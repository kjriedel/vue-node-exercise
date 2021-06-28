const cors = require("cors");
const express = require("express");
const Equipment = require("./equipmentData");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.options("*", cors());

app.get("/equipment", (req, res) => {
  setTimeout(() => {
    const randomNum = Math.floor(Math.random() * 10) + 1;

    if (randomNum > 7) {
      res.status(500).json({ error: "Ah jeez!" });
    } else {
      res.json(Equipment);
    }
  }, 800);
});

app.get("/equipment/:manufacturer", function(req, res) {
   setTimeout(function() {
     res.json(Equipment.filter(function(item) {
        return item.manufacturer && 
            item.manufacturer.toLowerCase() === req.params.manufacturer.toLowerCase();
     }));
    }, 800);
});

app.post("/ticket", function(req, res) {
    if (!equipmentHasSerialNumber(req.body.equipmentSerial)) {
        let err = 'Error saving ticket: invalid serial number';
        console.log(err);
        return res.status(500).send(err);
    }
    // For simplicity, will just store tickets in a local file instead of installing a DB
    if (!fs.existsSync(ticketsFile)) {
        saveTickets([ req.body ], res);
    } else {
        fs.readFile(ticketsFile, function(err, data) {
            if (err) {
                console.log(err);
                res.status(500).send('Error retrieving tickets');
            }  else {
                let tickets = JSON.parse(data);
                tickets.push(req.body);
                saveTickets(tickets, res);
            }
        });
    }
});

const equipmentHasSerialNumber = function(serialNumber) {
    return Equipment.find(function(item) {
         return item.serial_number &&
            item.serial_number === serialNumber;
    });
};

const saveTickets = function(data, res) {
    fs.writeFile(ticketsFile, JSON.stringify(data), function(err) {
        if (err) {
            console.log(err);
            res.status(500).send('Error saving ticket');
        } else {
            res.status(200).send('Successfully saved ticket');
        }
    });
}

const ticketsFile = './tickets.json';
const port = 8100;

app.listen(port, () => {
  console.log(`Listening on ${port}...`);
});
