//IMPORTS
import inquirer from 'inquirer';
import dotenv from 'dotenv';
import pkg from 'pg';

const { Client } = pkg;

// const  { Client } = require('pg');
// const inquirer = require('inquirer');
dotenv.config();


/* CLIENT */

async function connect(){

    const client = new Client({
        // host: 'localhost',
        // port: 1010,
        // user: 'user',
        // password: 'password',
        // database: 'employee_tracker'

        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 1010,
        user: process.env.DB_USER || 'user',
        password: process.env.DB_PASS || 'password',
        database: process.env.DB_NAME || 'employee_tracker'
    });

    try{
        await client.connect();
        console.log('Connected to the database');
        mainMenu();
    } catch (error){
        console.error('Failed to connect:', error.stack);
        process.exit(1);
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
async function viewDepartments() {}


//VIEW ROLES
async function viewRoles() {}


//VIEW EMPLOYEES
async function viewEmployees() {
    const client = await connect();
    try {
        const result = await client.query(
            // 'SELECT * FROM employees'
            `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager from employees`
            + ' LEFT JOIN roles ON employees.role_id = roles.id'
            + ' LEFT JOIN departments ON roles.department_id = departments.id'
        );

        if (result.rows.length === 0) {
            console.log('No employees found');
        }else{
            console.table(result.rows);
        }





    }catch (error){
        console.error('Failed to view employees:', error.stack);
        mainMenu();

    }
}




/* ADD */


// ADDS DEPARTMENTS
async function addDepartment() {
    const department = await inquirer.prompt({
        message: 'What is the name of the department?',
        type: 'input',
        name: 'name'
    });

    try {
        await client.query('INSERT INTO departments (name) VALUES ($1)', [department.name]);
        console.log('Added department:', department.name);
        mainMenu();
    } catch (error) {
        console.error('Failed to add department:', error.stack);
        mainMenu();
    }
}

/* UPDATE EMPLOYEES */


mainMenu();