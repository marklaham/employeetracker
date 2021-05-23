const mysql = require('mysql');
const inquirer = require('inquirer');

//const departmentList = [];
const choiceArray = [];

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'employeeTrackerDB',
});


const promptUser = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'options',
      message: 'What action would you like to take?',
      choices: [
        "ADD AN EMPLOYEE",
        "ADD A DEPARTMENT",
        "ADD A ROLE",
        "VIEW DEPARTMENTS",
        "VIEW EMPLOYEE ROLES",
        "VIEW EMPLOYEES",
        "UPDATE AN EXISTING EMPLOYEE",
        "Exit"],
    },
  ])
  .then((response) => {
    switch (response.options) {
      case "ADD AN EMPLOYEE":
        addEmployee();
        break;
      case "ADD A DEPARTMENT":
        addDepartment();
        break;
      case "ADD A ROLE":
        addRole();
        break;
      case "VIEW DEPARTMENTS":
        viewDepartment();
        break;
      case "VIEW EMPLOYEE ROLES":
        viewRoles();
        break;
      case "VIEW EMPLOYEES":
        viewEmployees();
        break;
      case "UPDATE AN EXISTING EMPLOYEE":
        updateEmployee();
        break;
      case "EXIT":
          break;
    }
  })
}
promptUser();


function viewEmployees() {
  console.log("view employee")
  const query =  `SELECT 
                    e.firstName,
                     e.lastName, 
                     r.title, 
                     r.salary,
                     d.departmentName
                  FROM employee e
                  JOIN role r ON e.roleID = r.id 
                  JOIN department d ON r.id = d.id;`;
 // const query = `select employee.firstName, employee.lastName, role.title, role.salary, department.departmentName from Employee; `;
  connection.query(query, function (err, res) {
    console.table(res)
    promptUser();
  });
}

function addEmployee(){
  console.log("adding employee")

  const promptU = () => {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'What is their first name?',
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'What is their last name?',
      },
      {
        type: 'input',
        name: 'roleID',
        message: 'What will be their role ID?',
      },
      {
        type: 'input',
        name: 'managerID',
        message: 'Who will be their manager ID?',
      },
    ])
    .then((response) => {
      const query = 'insert into employee(firstName, lastName, roleID, managerID) values (?,?,?,?);';
      connection.query(query, [ response.firstName,  response.lastName, response.roleID, response.managerID], (err, res) => {
        console.table(res);
        promptUser();
      });
    });
  }
  promptU();
}



function addDepartment(){
  console.log("adding employee")

  const promptU = () => {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the department?',
      },
      
    ])
    .then((response) => {
      const query = 'insert into department (departmentName) values (?);';
      connection.query(query, [ response.departmentName], (err, res) => {
        console.table(res);
        promptUser();
      });
    });
  }
  promptU();
}

function addRole(){

  connection.query('SELECT * FROM department', function (err, res) {
      console.log(res);
      if (err) throw err;

    //  const promptU = () => {
       inquirer.prompt([
          {
            type: 'input',
            name: 'title',
            message: 'What is the the role title?',
          },
          {
            type: 'input',
            name: 'salary',
            message: 'What is the salary?',
          },
          {
            type: 'list',
            name: 'options',
            choices() {
              
              res.forEach(({id, departmentName }) => {
                choiceArray.push({ 'id': id , "departmentName": departmentName});
              });
              console.log(choiceArray);
              const depNameArray = [];
              for (let i = 0; i < choiceArray.length; i++) {
                  depNameArray[i] = choiceArray[i].departmentName;
               }
           
              return depNameArray;
            },
            message: 'Choose departement:',
          },
        
        ])
        .then((response) => {
           const query = 'insert into role(title, salary, department_id) values (?,?,?);';
    
          const depChoice = choiceArray.filter(obj => {
            return obj.departmentName === response.options;
          });
          //console.log(depChoice);
          //console.log( depChoice[0].id);
          connection.query(query, [ response.title,  response.salary, depChoice[0].id], (err, res) => {
            console.table(response);
            promptUser();
          });
       });
  });


}

function viewDepartment(){
  console.log("View Departemnts")
  connection.query('SELECT * FROM department', function (err, res) {
    console.table(res)
    promptUser();
  });
}

function viewRoles(){
  console.log("View Roles")
  connection.query('SELECT * FROM role', function (err, res) {
    console.table(res);
    promptUser();
  });
}

function updateEmployee() {
  console.log("Updating an employee role")
  connection.query('SELECT * FROM employee', function (err, res) {
    console.log(res);
    if (err) throw err;
    const empArray = [];
  //  const promptU = () => {
     inquirer.prompt([
        // {
        //   type: 'input',
        //   name: 'title',
        //   message: 'What is the the role title?',
        // },
        // {
        //   type: 'input',
        //   name: 'salary',
        //   message: 'What is the salary?',
        // },
        {
          type: 'list',
          name: 'options',
          choices() {
            
            res.forEach(({roleID, firstName, lastName }) => {
              empArray.push({ 'roleID': roleID , "firstName": firstName, "lastName": lastName});
            });
            console.log(empArray);
            const empListArray = [];
            for (let i = 0; i < empArray.length; i++) {
                empListArray[i] = `${empArray[i].roleID}  ${empArray[i].firstName} ${empArray[i].lastName}`;  //.departmentName
             }
         
            return empListArray;
          },
          message: 'Choose the employee you wish to update:',
        },
         {
          type: 'input',
          name: 'newRole',
          message: 'What is their new role ID?',
        },
      
      ])
      .then((response) => {

        const choiceID = empArray.filter(obj => {
             return obj.id === response.id;
        });
        console.log(choiceID);

         const query = `UPDATE employeetrackerdb.employee SET roleID = ${response.newRole} WHERE id = ${choiceID}`;
        // const depChoice = choiceArray.filter(obj => {
        //   return obj.departmentName === response.options;
        // });
        //console.log(depChoice);
        //console.log( depChoice[0].id);
        connection.query(query,  (err, res) => {
          console.table(response);
          promptUser();
        });
     });
});
}




