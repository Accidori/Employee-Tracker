//IMPORTS
import inquirer from 'inquirer';
import dotenv from 'dotenv';
import consoleTable from 'console.table';
import pkg from 'pg';

const { Client } = pkg;

// const  { Client } = require('pg');
// const inquirer = require('inquirer');

dotenv.config();


/* CLIENT */

async function connect() {
    const client = new Client({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
    });

    try {
        await client.connect();
        console.log('Connected to the database successfully');
        return client;
    } catch (error) {
        console.error('Failed to connect to the database:', error.stack);
        throw error;
    }
}



/* MAIN MENU */

async function mainMenu() {
    const answer = await inquirer.prompt({
        message: 'What would you like to do?',
        type: 'list',
        name: 'menu',
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

    switch(answer.menu) {
        case 'View All Departments':
            await viewDepartments();
            break;
        case 'View All Roles':
            await viewRoles();
            break;
        case 'View All Employees':
            await viewEmployees();
            break;
        case 'Add A Department':
            await addDepartment();
            break;
        case 'Add A Role': 
            await addRole();
            break;
        case 'Add An Employee': 
            await addEmployee();
            break;
        case 'Update An Employee Role':
            await updateEmployee();
            break;
        case 'Exit':
            console.log('Goodbye!');
            process.exit();
        default:
            console.log('Whoops! Something went wrong!');
            break;
    }
}



/* VIEW */


// VIEW DEPARTMENTS
async function viewDepartments() {
    const client = await connect();
    try{
        const result = await client.query(`SELECT * FROM department`)

        if (result.rows.length === 0) {
            console.log('No departments found');
        }else{
            consoleTable(result.rows);
        }
    } catch (error){
        console.error('Failed to view departments:', error.stack);
        mainMenu();

    }
}


//VIEW ROLES
async function viewRoles() {
    const client = await connect();
    try {
        const result = await client.query(`SELECT * from role`);

        if (result.rows.length === 0) {
            console.log('No roles found');
        }else{
            consoleTable(result.rows);
        }

    }catch (error){
        console.error('Failed to view roles:', error.stack);
        mainMenu();

    }
}


//VIEW EMPLOYEES
async function viewEmployees() {
    const client = await connect();
    try {
        const result = await client.query(`SELECT * FROM employee`);

        if (result.rows.length === 0) {
            console.log('No employees found');
        }else{
            consoleTable(result.rows);
        }

    }catch (error){
        console.error('Failed to view employees:', error.stack);
        mainMenu();
    }
}




/* ADD */


// ADDS DEPARTMENTS
async function addDepartment() {
    const client = await connect();
    try{
        const answer = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter the name of the department:',
            }
        ]);
    } catch (error){
        const query = 'INSERT INTO departments (name) VALUES ($1)';
        client.query(query, [answer.name], (err, res) => {
            if (err) {
                console.error('Error executing query', err.stack);
                return;
            }
            console.log('Department added successfully');
        });
    }
    mainMenu();
}

///fix the add department function


// ADDS EMPLOYEE
async function addEmployee() {
    const client = await connect();
    try{
        const answer = await inquirer.prompt([
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
        ])


        const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';

        await client.query(query, [answers.firstName, answers.lastName, answers.roleId, answers.managerId]);
        console.log('Employee added successfully');
    } catch (error) {
        console.error('Error executing query', console.error());
        return;
    }
    mainMenu();
}                                 

// ADDS ROLE
async function addRole() {
    const client = await connect();

    try{
        const answer = await inquirer.prompt([
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
        ]);

        const query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';

        await client.query(query, [answers.title, answers.salary, answers.departmentId]);

        console.log('Role added successfully');
    } catch (error){
        console.error('Error executing query', err.stack);
        return;
   
    }
    mainMenu();
}




/* UPDATE EMPLOYEES */



async function updateEmployee() {
    const client = await connect();

    try {
        // get all roles
        const roleResult = await client.query('SELECT * FROM role');
        const roleChoices = roleResult.rows.map(row => ({ name: row.title, value: row.id }));

        // get all employees
        const employeeResult = await client.query('SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employee');
        const employeeChoices = employeeResult.rows.map(row => ({ name: row.name, value: row.id }));

        const answers = await inquirer.prompt([
            {
                message: 'Which employee\'s role do you want to update?',
                type: 'list',
                name: 'employeeId',
                choices: employeeChoices
            },
            {
                message: 'What is the employee\'s new role?',
                type: 'list',
                name: 'roleId',
                choices: roleChoices
            }
        ]);

        const { employeeId, roleId } = answers;

        // Update the employee's role
        const query = `UPDATE employee SET role_id = $1 WHERE id = $2`;
        await client.query(query, [roleId, employeeId]);

        console.log(`Updated employee's role successfully`);
    } catch (error) {
        console.error('Failed to update employee:', error.stack);
    }
    mainMenu();
}





mainMenu();