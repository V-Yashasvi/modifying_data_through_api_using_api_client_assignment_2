const express = require('express');
const { resolve } = require('path');
const mongoose= require('mongoose');
const dotenv= require('dotenv');
dotenv.config();
const app = express();
const port = 3011;
const Menu=require('./schema')
app.use(express.json())
app.use(express.static('static'));

const mongoURL=process.env.url;
mongoose.connect(mongoURL).then(()=>{
  console.log("MongoDB connected successfully")
}).catch((err)=>{
    console.log(err)
  })

app.get('/menu', async(req, res)=>{
  try{
    const menu=await menu.find()
    res.send(menu)
  }catch(err){
    res.send(err)
  }
})

app.post('/menu', async(req,res)=>{
  const payload= req.body
  console.log(payload)
  try {
    const new_item=new Menu(payload)
    await new_item.save();
    res.status(201).json({message:"New item added to the menu", new_item})
  } catch (err) {
    console.error(err);
    res.status(500).json({error:err})
  }
})

app.put('/menu/:id', async(req, res)=>{
  try {
    let id=req.params.id;
    const updated_item=await Menu.findByIdAndUpdate(id, req.body, {new:true})
    if(!updated_item){
      return res.status(404).json({message:"Item not found"})
    }
    return res.status(200).json({message:"Item updated successsfully", data:updated_item})
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

app.delete('/menu/:id', async(req, res)=>{
  try {
    const id=req.params.id
    const deleted_item=Menu.findByIdAndDelete(id);
    if (!deleted_item){
      res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
