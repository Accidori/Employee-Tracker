
-- departments --
INSERT INTO department (name) 
VALUES 
    ('Engineering'),
    ('Sales'),
    ('Finance'),
    ('Legal');

-- roles --
INSERT INTO role (title, salary, department_id) 
VALUES 
    ('Software Engineer', 100000, 1), 
    ('Sales Lead', 80000, 2),
    ('Accountant', 70000, 3),
    ('Lawyer', 90000, 4);

-- employees -- 
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES 
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Doe', 2, 4),
    ('Jim', 'Doe', 3, 2),
    ('Josh', 'Doe', 4, NULL);
