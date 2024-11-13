//IMPORTS
import inquirer from 'inquirer';
import pkg from 'pg';
const { Client } = pkg;



/* CLIENT */


const client = new Client({
    host: 'localhost',
    port: 1010,
    user: 'user',
    password: 'password',
    database: 'employee_tracker'
});


// client.connection((err) => {
//     console.log('Connected to the database');
// });


/* MAIN MENU */


async function startApp() {
    const answer = await inquirer.prompt({
        message: 'What would you like to do?',
        type: 'list',
        name: 'action',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add A Department',
            'Add A Role', 
            'Add An Employee', 
            'Update An Employee Role',
            'Exit'
        ],
    })

    switch(answer.action) {
        case 'View All Departments':
            viewDepartments();
            break;
        case 'View All Roles':
            viewRoles();
            break;
        case 'View All Employees':
            viewEmployees();
            break;
        case 'Add A Department':
            addDepartment();
            break;
        case 'Add A Role': 
            addRole();
            break;
        case 'Add An Employee': 
            addEmployee();
            break;
        case 'Update An Employee Role':
            updateEmployee();
            break;
        case 'Exit':
            console.log('Goodbye!');
            process.exit();
            break;
        default:
            console.log('Whoops! Something went wrong!');
            break;
    }
}


/* ADD */


// ADDS DEPARTMENTS
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:',
        }
    ]).then(answer => {
        const query = 'INSERT INTO departments (name) VALUES ($1)';
        client.query(query, [answer.name], (err, res) => {
            if (err) {
                console.error('Error executing query', err.stack);
                return;
            }
            console.log('Department added successfully');
        });
    });
    startApp();
}

// ADDS EMPLOYEE
function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the first name of the employee:',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the last name of the employee:',
        },
        {
            type: 'input',
            name: 'roleId',
            message: 'Enter the role ID of the employee:',
        },
        {
            type: 'input',
            name: 'managerId',
            message: 'Enter the manager ID of the employee (if any):',
        }
    ]).then(answers => {
        const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
        client.query(query, [answers.firstName, answers.lastName, answers.roleId, answers.managerId], (err, res) => {
            if (err) {
                console.error('Error executing query', err.stack);
                return;
            }
            console.log('Employee added successfully');
            startApp();
        });
    });
}

// ADDS ROLE
function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the role:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary of the role:',
        },
        {
            type: 'input',
            name: 'departmentId',
            message: 'Enter the department ID of the role:',
        }
    ]).then(answers => {
        const query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';
        client.query(query, [answers.title, answers.salary, answers.departmentId], (err, res) => {
            if (err) {
                console.error('Error executing query', err.stack);
                return;
            }
            console.log('Role added successfully');
            startApp();
        });
    });
}




/* UPDATE EMPLOYEES */



function updateEmployee() {
    client.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;

        const roleChoices = res.rows.map(row => row.title);

        inquirer.prompt([
            {
                message: 'Which employee\'s role do you want to update?',
                type: 'list',
                name: 'whichEmployee',
                choices: [
                    'Jane Doe',
                    'Jim Doe',
                    'John Doe'
                ]
            },
            {
                message: 'What is the employee\'s new role?',
                type: 'list',
                name: 'newRole',
                choices: roleChoices
            }
        ]).then(answers => {
            const { whichEmployee, newRole } = answers;

            // Get the role_id for the selected role
            const selectedRole = res.rows.find(row => row.title === newRole);
            const role_id = selectedRole.id;

            const query = `UPDATE employee SET role_id = $1 WHERE name = $2`;
            client.query(query, [role_id, whichEmployee], (err, res) => {
                if (err) throw err;
                console.log(`Updated ${whichEmployee}'s role to ${newRole}`);
                startApp();
            });
        });
    });
}



/* VIEW */


// VIEW DEPARTMENTS
function viewDepartments() {
    client.query(`SELECT * FROM department`, (err, res) => {
        if (err) {
            console.error('Error executing query', err.stack);
            return;
        }
        console.table(res);
        startApp();
    });
}

// VIEW EMPLOYEES
function viewEmployees() {
    client.query(`SELECT * FROM employee`, (err, res) => {
        if (err) {
            console.error('Error executing query', err.stack);
            return;
        }

        console.table(res);
        startApp();
    });
}

// VIEW ROLES
function viewRoles() {
    client.query(`SELECT * FROM roles`, (err, res) => {
        if (err) {
            console.error('Error executing query', err.stack);
            return;
        }
        console.table(res);
        startApp();
    });
}


















startApp();

// export default startApp;

/* PLACEHOLDERS */

//NAMES
    //Jane Doe
    //Jim Doe
    //John Doe

//DEPARTMENTS
    //Sales
    //Engineering
    //Finance
    //Legal

//ROLES
    //Sales Lead
    //Salesperson
    //Lead Engineer
    //Software Engineer
    //Accountant
    //Legal Team Lead
    //Lawyer
