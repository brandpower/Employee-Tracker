use employees_db;

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Harry', 'Potter', 1, NULL),
    ('Hermionie', 'Granger', 2, 1),
    ('Ron', 'Weasley', 3, NULL),
    ('Remus', 'Lupin', 4, 3),
    ('Albus', 'Dumbledore', 5, NULL),
    ('Sirius', 'Black', 6, 5),
    ('Luna', 'Lovegood', 7, NULL),
    ('Colin', 'Creevey', 8, 7);

SELECT role.id, title, salary, name
FROM role left join department on role.department_id = department.id 