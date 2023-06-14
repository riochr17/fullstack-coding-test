const express = require('express')
const app = express(); 
const OrganizationNode = []; 
const Tree = [];

const db = require("./../models/index");
const OrganizationalStructures = db.OrganizationalStructure;


class TreeNode {
    constructor(value) {
      this.value = value;
      this.children = [];
    }

    
}

app.post('/', async (req, res, next) => {
    try {
        const array1 = req.body.arr1;
        const array2 = req.body.arr2;
        const set1 = new Set(array1);
        const set2 = new Set(array2);
        const intersection = await [...set1].filter((element) => set2.has(element));
        res.send(intersection);
    }
    catch(error) {
        res.send(error);
    }
})

app.post('/soal-1', async (req, res, next) => {
    try {
        const array1 = req.body.arr1;
        const array2 = req.body.arr2;
        const set1 = new Set(array1);
        const set2 = new Set(array2);
        const intersection = await [...set1].filter((element) => set2.has(element));
        res.send(intersection);
    }
    catch(error) {
        res.send(error);
    }
})

app.post('/soal-2', async(req,res,next) => {
    try {
        const array = req.body.arr1;

        const root = await new TreeNode(array[0]);
        const stack = [root];
    
        for (let i = 1; i < array.length; i++) {
            const node = new TreeNode(array[i]);
            const parent = stack[stack.length - 1];
    
            parent.children.push(node);
            stack.push(node);
        }

        console.log(root);
    
        const result = [];

        function traverse(node) {
            result.push(node.value);

            for (let child of node.children) {
                traverse(child);
            }
        }

        traverse(root);
        let responseValue = {
            'Input Array:': array,
            'Generated Tree': root,
            'Flattened Array': result,
            'Time Complexity': "O(n)",
            'Space Complexity': "O(n)"
        }
        res.send({
            responseValue
        });

    }
    catch(error) {
        res.send(error)
    }

})

app.post('/soal-3', async(req,res,next) => {
    try {
        const array = req.body.arr1;
        const nodeMap = {};
        array.forEach((orgNode) => {
            const { label, parent } = orgNode;
            const newNode = {
                label,
                children: [],
            };

            nodeMap[label] = newNode;

            if (parent !== null) {
                const parentNode = nodeMap[parent];
                parentNode.children.push(newNode);
            }
        });

        console.log(nodeMap[1])

        let tree = nodeMap[1];
        const result = [];

        function traverse(node) {
            result.push(node.label);

            for (let child of node.children) {
                traverse(child);
            }
        }

        traverse(tree);

        
        let responseValue = {
            'Input Array:': array,
            'Generated Tree': nodeMap,
            'Flattened Array': result,
        }
        res.send({
            responseValue
        });
    }
    catch(error) {
        res.send(error)
    } 

})

app.get('/data', async(req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = 3; 
    const offset = (page - 1) * limit; 
  
    try {
      const totalCount = await OrganizationalStructures.count(); 
      const totalPages = Math.ceil(totalCount / limit); 

      const items = await OrganizationalStructures.findAll({offset, limit});
  
      res.json({
        'code': '200',
        'totalPages': totalPages,
        'currentPage': page,
        'data': items
      })
    } catch (error) {
      console.error('Error retrieving items:', error.message);
    
    }
})

app.get('/data-detail', async(req, res) => {
    const id = req.query.id;
    const page = parseInt(req.query.page) || 1; 
    const limit = 3; 
    const offset = (page - 1) * limit; 
  
    try {
      const totalCount = await OrganizationalStructures.count(); 
      const totalPages = Math.ceil(totalCount / limit); 

      const items = await OrganizationalStructures.findAll({'id': id}, {offset, limit});
  
      res.json({
        'code': '200',
        'totalPages': totalPages,
        'currentPage': page,
        'data': items
      })
    } catch (error) {
      console.error('Error retrieving items:', error.message);
    
    }
})




module.exports = app;