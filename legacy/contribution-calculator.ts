// ============================================
// TAREA OPCIONAL B: Refactorizar este código
// ============================================
//
// Este módulo calcula aportaciones a planes de pensiones.
// Tiene múltiples code smells que debes identificar y corregir:
// - God class
// - Magic numbers
// - Callbacks anidados
// - Sin tipos adecuados
// - Lógica duplicada
// - Sin tests
//
// Tu trabajo:
// 1. Refactorizar aplicando patrones apropiados
// 2. Mantener la funcionalidad exacta
// 3. Añadir tests
// 4. Documentar tus decisiones

// @ts-nocheck
/* eslint-disable */

var ContributionCalculator = function () {
  this.contributions = [];
  this.errors = [];
  this.processed = 0;
  this.db = null;
  this.cache = {};
};

ContributionCalculator.prototype.init = function (dbConnection, callback) {
  var self = this;
  self.db = dbConnection;
  // Load config from db
  self.db.query("SELECT * FROM config", function (err, result) {
    if (err) {
      callback(err);
    } else {
      self.config = {};
      for (var i = 0; i < result.length; i++) {
        self.config[result[i].key] = result[i].value;
      }
      callback(null);
    }
  });
};

ContributionCalculator.prototype.calculateMonthlyContribution = function (
  employee,
  callback
) {
  var self = this;
  // Check cache first
  var cacheKey = employee.id + "_" + new Date().getMonth();
  if (self.cache[cacheKey]) {
    callback(null, self.cache[cacheKey]);
    return;
  }

  // Get employee's plan
  self.db.query(
    "SELECT * FROM pension_plans WHERE id = " + employee.pensionPlanId,
    function (err, plans) {
      if (err) {
        callback(err);
        return;
      }
      if (plans.length == 0) {
        callback(new Error("Plan not found"));
        return;
      }
      var plan = plans[0];

      // Get company config
      self.db.query(
        "SELECT * FROM company_config WHERE company_id = " + employee.companyId,
        function (err2, configs) {
          if (err2) {
            callback(err2);
            return;
          }

          var companyConfig = configs[0] || {};
          var baseContribution = employee.salary * 0.05; // 5% of salary

          // Apply plan multiplier
          if (plan.riskLevel == "conservative") {
            baseContribution = baseContribution * 0.8;
          } else if (plan.riskLevel == "balanced") {
            baseContribution = baseContribution * 1.0;
          } else if (plan.riskLevel == "dynamic") {
            baseContribution = baseContribution * 1.2;
          }

          // Check max contribution (8500€ yearly limit in Spain)
          var yearlyMax = 850000; // in cents
          var monthlyMax = yearlyMax / 12;
          if (baseContribution > monthlyMax) {
            baseContribution = monthlyMax;
          }

          // Apply company matching
          var employerContribution = 0;
          if (companyConfig.matchingEnabled) {
            // Company matches up to a percentage
            var matchRate = companyConfig.matchRate || 0.5; // 50% default
            var matchLimit = companyConfig.matchLimit || 100000; // 1000€ monthly limit
            employerContribution = baseContribution * matchRate;
            if (employerContribution > matchLimit) {
              employerContribution = matchLimit;
            }
          }

          // Calculate tax benefit (simplified)
          var taxBenefit = 0;
          if (employee.marginalTaxRate) {
            taxBenefit = baseContribution * (employee.marginalTaxRate / 100);
          } else {
            // Estimate based on salary
            if (employee.salary < 2000000) {
              // < 20k
              taxBenefit = baseContribution * 0.19;
            } else if (employee.salary < 3500000) {
              // < 35k
              taxBenefit = baseContribution * 0.24;
            } else if (employee.salary < 6000000) {
              // < 60k
              taxBenefit = baseContribution * 0.3;
            } else {
              taxBenefit = baseContribution * 0.37;
            }
          }

          var result = {
            employeeId: employee.id,
            employeeContribution: Math.round(baseContribution),
            employerContribution: Math.round(employerContribution),
            totalContribution:
              Math.round(baseContribution) + Math.round(employerContribution),
            taxBenefit: Math.round(taxBenefit),
            netCost: Math.round(baseContribution - taxBenefit),
            calculatedAt: new Date(),
          };

          // Cache result
          self.cache[cacheKey] = result;

          callback(null, result);
        }
      );
    }
  );
};

ContributionCalculator.prototype.processAllEmployees = function (
  companyId,
  callback
) {
  var self = this;
  self.contributions = [];
  self.errors = [];
  self.processed = 0;

  // Get all employees
  self.db.query(
    "SELECT * FROM employees WHERE company_id = " +
      companyId +
      " AND onboarding_status = 'completed'",
    function (err, employees) {
      if (err) {
        callback(err);
        return;
      }

      if (employees.length == 0) {
        callback(null, { contributions: [], errors: [], total: 0 });
        return;
      }

      var completed = 0;
      for (var i = 0; i < employees.length; i++) {
        (function (emp) {
          self.calculateMonthlyContribution(emp, function (err, result) {
            completed++;
            if (err) {
              self.errors.push({ employeeId: emp.id, error: err.message });
            } else {
              self.contributions.push(result);
            }
            if (completed == employees.length) {
              // All done
              var totalContributions = 0;
              for (var j = 0; j < self.contributions.length; j++) {
                totalContributions += self.contributions[j].totalContribution;
              }
              callback(null, {
                contributions: self.contributions,
                errors: self.errors,
                total: totalContributions,
              });
            }
          });
        })(employees[i]);
      }
    }
  );
};

ContributionCalculator.prototype.generateReport = function (
  companyId,
  month,
  year,
  callback
) {
  var self = this;

  // Get contributions for the month
  self.db.query(
    "SELECT c.*, e.first_name, e.last_name, e.email FROM contributions c JOIN employees e ON c.employee_id = e.id WHERE e.company_id = " +
      companyId +
      " AND c.period = '" +
      year +
      "-" +
      (month < 10 ? "0" + month : month) +
      "'",
    function (err, contributions) {
      if (err) {
        callback(err);
        return;
      }

      // Calculate totals
      var totalEmployee = 0;
      var totalEmployer = 0;
      var totalTax = 0;

      for (var i = 0; i < contributions.length; i++) {
        totalEmployee += contributions[i].employee_amount;
        totalEmployer += contributions[i].employer_amount;
        // Recalculate tax benefit
        if (contributions[i].employee_amount < 2000000) {
          totalTax += contributions[i].employee_amount * 0.19;
        } else if (contributions[i].employee_amount < 3500000) {
          totalTax += contributions[i].employee_amount * 0.24;
        } else if (contributions[i].employee_amount < 6000000) {
          totalTax += contributions[i].employee_amount * 0.3;
        } else {
          totalTax += contributions[i].employee_amount * 0.37;
        }
      }

      var report = {
        companyId: companyId,
        period: year + "-" + (month < 10 ? "0" + month : month),
        employeeCount: contributions.length,
        totalEmployeeContributions: totalEmployee,
        totalEmployerContributions: totalEmployer,
        grandTotal: totalEmployee + totalEmployer,
        estimatedTaxBenefit: Math.round(totalTax),
        contributions: contributions.map(function (c) {
          return {
            name: c.first_name + " " + c.last_name,
            email: c.email,
            employee: c.employee_amount,
            employer: c.employer_amount,
            total: c.employee_amount + c.employer_amount,
          };
        }),
      };

      callback(null, report);
    }
  );
};

ContributionCalculator.prototype.validateContribution = function (
  contribution
) {
  var errors = [];

  if (!contribution.employeeId) {
    errors.push("Missing employee ID");
  }
  if (
    contribution.employeeContribution < 0 ||
    contribution.employeeContribution > 850000
  ) {
    errors.push("Invalid employee contribution amount");
  }
  if (contribution.employerContribution < 0) {
    errors.push("Invalid employer contribution amount");
  }
  // Check yearly limit
  if (contribution.employeeContribution + contribution.employerContribution > 850000) {
    errors.push("Exceeds yearly maximum");
  }

  return errors;
};

ContributionCalculator.prototype.saveContribution = function (
  contribution,
  callback
) {
  var self = this;
  var validation = self.validateContribution(contribution);
  if (validation.length > 0) {
    callback(new Error("Validation failed: " + validation.join(", ")));
    return;
  }

  var now = new Date();
  var period = now.getFullYear() + "-" + (now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1);

  self.db.query(
    "INSERT INTO contributions (employee_id, pension_plan_id, employee_amount, employer_amount, period, created_at) VALUES (" +
      "'" +
      contribution.employeeId +
      "', " +
      "'" +
      contribution.pensionPlanId +
      "', " +
      contribution.employeeContribution +
      ", " +
      contribution.employerContribution +
      ", " +
      "'" +
      period +
      "', " +
      "NOW())",
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        contribution.id = result.insertId;
        self.contributions.push(contribution);
        self.processed++;
        callback(null, contribution);
      }
    }
  );
};

ContributionCalculator.prototype.clearCache = function () {
  this.cache = {};
};

ContributionCalculator.prototype.getStats = function () {
  return {
    processed: this.processed,
    errors: this.errors.length,
    cached: Object.keys(this.cache).length,
  };
};

module.exports = ContributionCalculator;
