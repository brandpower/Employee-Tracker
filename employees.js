
// requiring dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    // Your username
    user: "",

    // Your password
    password: "",
    database: "employees_db",
});

connection.connect(function (err) {
    if (err) throw err;
    modifyEmployee();
});
// function to offer the user options for the database
async function modifyEmployee() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            Message: "What would you like to do?",
            choices: [
                "View All Roles",
                "View All Employees",
                "View Departments",
                "Add a Role",
                "Add a Department",
                "Add an Employee",
                "Update an Employee Role",
                "Exit",
            ],
        })
        // apply the switch case so that each question above can have a unique fucntion called
        .then(async function (answer) {
            switch (answer.action) {
                case "View All Roles":
                    viewAllRoles();
                    break;

                case "View All Employees":
                    viewAllEmployees();
                    break;

                case "View Departments":
                    viewDepartments();
                    break;

                case "Add a Role":
                    const newRoleAnswer = await inquirer.prompt([
                        {
                            name: "addRole",
                            type: "input",
                            message: "What is the new Role title?",
                        },
                        {
                            name: "addSalary",
                            type: "input",
                            message: "What is the new Role salary?",
                        },
                        {
                            name: "addRoleDptId",
                            type: "number",
                            message: "What is the new Role department id?",
                        },
                    ]);

                    addRole(newRoleAnswer);
                    break;

                case "Add a Department":
                    const newDeptAnswer = await inquirer.prompt([
                        {
                            name: "addDeptName",
                            type: "input",
                            message: "What is the new Dept Name?",
                        },
                    ]);

                    addDepartment(newDeptAnswer);
                    break;

                case "Add an Employee":
                    const newEmpAnswer = await inquirer.prompt([
                        {
                            name: "first_name",
                            type: "input",
                            message: "What is the new employee first name?",
                        },
                        {
                            name: "last_name",
                            type: "input",
                            message: "What is the new employee last name?",
                        },
                        {
                            name: "role_id",
                            type: "input",
                            message: "What is the new employee's role id?",
                        },
                        {
                            name: "manager_id",
                            type: "input",
                            message: "What is the new employee's manager's id?",
                        },
                    ]);

                    addEmployee(newEmpAnswer);
                    break;

                case "Update an Employee Role":
                    const updateEmpRoleAnswer = await inquirer.prompt([
                        {
                            name: "empId",
                            type: "input",
                            message: "What Employee Id would you like to update?",
                        },
                        {
                            name: "roleId",
                            type: "input",
                            message: "What is the new Role Id?",
                        },
                    ]);

                    updateEmpRole(updateEmpRoleAnswer);
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}

// view All Roles function
function viewAllRoles() {
    connection.query(
        "SELECT role.id, title, salary, name FROM role left join department on role.department_id = department.id",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            modifyEmployee();
        }
    );
}

// view all Employees function
function viewAllEmployees() {
    connection.query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            modifyEmployee();
        }
    );
}

// view Departments function
function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        modifyEmployee();
    });
}

// Add a Role function
function addRole(newRoleAnswer) {
    connection.query(
        "INSERT INTO role SET ? ",
        {
            title: newRoleAnswer.addRole,
            salary: newRoleAnswer.addSalary,
            department_id: newRoleAnswer.addRoleDptId,
        },
        function (err, res) {
            if (err) throw err;
            console.table(res);
            modifyEmployee();
        }
    );
}

// Add a Department function
function addDepartment(newDeptAnswer) {
    connection.query(
        "INSERT INTO department SET ? ",
        {
            name: newDeptAnswer.addDeptName,
        },
        function (err, res) {
            if (err) throw err;
            console.table(res);
            modifyEmployee();
        }
    );
}
// Add an Employee function
function addEmployee(newEmpAnswer) {
    console.log(newEmpAnswer);
    connection.query(
        "INSERT INTO employee SET ? ",
        newEmpAnswer,

        function (err, res) {
            if (err) throw err;
            console.table(res);
            modifyEmployee();
        }
    );
}

// Update a Role function
function updateEmpRole(updateEmpRoleAnswer) {
    connection.query(
        "UPDATE employee SET ? WHERE ?",
        [
            { role_id: updateEmpRoleAnswer.roleId },
            { id: updateEmpRoleAnswer.empId },
        ],
        function (err, res) {
            if (err) throw err;
            console.table(res);
            modifyEmployee();
        }
    );
}