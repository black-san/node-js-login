const e = require('express');

exports.display = function(taskList) {
    let htmlResult = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tasks</title>

    <style>
        .result-row {
            display: flex;
            flex-direction: row;
            width: 100%;
        }
        .result-head {
            width: 25%;
            background-color: #535b53;
            color: #ffff;
            text-align: center;
            border: 1px solid #ffff;
        }
        .result-column {
            width: 25%;
            background-color: #e0e0e0;
            text-align: center;
            border: 1px solid #ffff;
        }
        .task-view {
            margin: auto;
            font-family: Arial, Helvetica, sans-serif;
        }
        h1{
            text-align: center;
            color: #3ecc62;
            font-size: 24px;
            padding: 20px 0 20px 0;            
        }
        .task-view input[type="submit"] {
            background-color: #3ecc62;
            border: 0;
            box-sizing: border-box;
            cursor: pointer;
            font-weight: bold;
            color: #ffff;
        }
    </style>

</head>
<body>
    <script type="text/javascript">
    var xhr = new XMLHttpRequest();
    
    function approveTask(taskId) {
        console.log("Clicked");
        xhr.open("POST", '/approve', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            taskId: taskId
        }));   
    }
    </script>
    <div class="task-view">
        <h1>Tasks List</h1>
        <div>
        <div class="result-row">
            <div class="result-head"><h3>Title</h3></div>
            <div class="result-head"><h3>Description</h3></div>
            <div class="result-head"><h3>Status</h3></div>
            <div class="result-head"><h3>Approve</h3></div>
        </div>
  `;
  for(let task of taskList){
      if(task.isConfirmed === 0 && task.isApprovedByUser === 0) {
        htmlResult += `<div class="result-row">
                        <div class="result-column">${task.title}</div>
                        <div class="result-column">${task.description}</div>
                        <div class="result-column">Waiting..</div>
                        <div class="result-column">
                        <form action="approve" method="POST">
                        <input type="hidden" name="taskId" value="${task.id}"></input>
                        <input type="submit" value="Approve">
                        </form>
                        </div>
                    </div>`;
        }
        else if(task.isConfirmed === 0 && task.isApprovedByUser > 0) {
            htmlResult += `<div class="result-row">
                        <div class="result-column">${task.title}</div>
                        <div class="result-column">${task.description}</div>
                        <div class="result-column">Waiting..</div>
                        <div class="result-column">Already approved by you</div>
                    </div>`;
        }
        else {
            htmlResult += `<div class="result-row">
                        <div class="result-column">${task.title}</div>
                        <div class="result-column">${task.description}</div>
                        <div class="result-column">Approved</div>
                        <div class="result-column">Completed</div>
                    </div>`;
        }
      }
    

  htmlResult += `</table>
                </div>
                </body>
                </html>`;

  return htmlResult;
}
