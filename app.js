//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const load = require("lodash");
const mongoose = require("mongoose");
const axios = require("axios");

const homeStartingContent = "A journal is a record that stores every details of your life ranging from events, ideas, feelings, and your daily thoughts and memories. In this way, you will be able to remember what you did, what you were thinking and feeling, and what had happened when you were younger. We'll look into how a journal can be used in a many ways!";
const aboutContent = `Dear children of the future, we want to take a moment to tell you about our planet and how it used to be before your time, so that you value what you have now. Our jungles were eaten away by concrete, the skies were unpredictable, diseases were rampant, our rivers turned brown and the life in them retreated quietly. All that remained behind were wastelands. But that’s when the superheroes stepped in…
Wait, before we get too far ahead of ourselves, let’s re-wind this tale all the way back to 2017. Quite a few significant things happened that year. Britain took another step towards leaving the European Union. The globe got considerably warmer.  And somewhere in the city of Mumbai, India, Amishi Parasampuria was working very hard on something called the Bottle Bricks Project. The Bottle Bricks project involved 1500 + students from around Mumbai in building Eco-Bricks from upcycled plastic waste, which were to be used in construction sites.
That’s when Amishi had a little Eureka moment – Why not teach young, moldable minds about sustainability than wait for them to become wasteful adults accustomed to age-old habits? Amishi did not waste any time. Within a year, she was on her way to setting up Upcycler's Lab, to help children become the agents of change they are meant to be. She just was not sure how to get to them. But two minds are always better than one, right? Enter Manav Shah!
Manav happened to be looking for a detour from the fashion industry right around that time. He had decided that he no longer wanted to work with the non-sustainable materials that the fashion industry was used to and was looking for a fresh start. When Amishi told him about Upcycler’s Lab, there was just no doubt in his mind that this was it! Well, the rest, as they say, is history!
No, not quite. Manav and Amishi still had a lot of work to do! They knew that the best way to teach children about sustainability was to give them information when they were in their element – during play time! However, they still had to figure out how to bridge the gap between play and learning. They started out by making activity boxes - Kids loved them. But just once. And then they got bored and went back to their Televisions. So, they had to think of something that lasted a bit longer. What was fun to play, could involve multiple players and could be played countless times (oh, and does not use up electricity)? Board games! The activity boxes soon evolved into board games, puzzles and flash cards around environmental education which could be used repeatedly.  
Then, there was just no going back! Upcycler’s Lab started working closely with governments across Asia, Europe and the Middle east to implement these interactive games into green programs in schools so that we could power a more conscious generation. Our products don’t just teach sustainability but practice it too! They are crafted recycled paper and printed using non-toxic dyes. Our games have been designed to remind not just children, but all of us, that the fight against climate change requires all of humanity to come together to consistently create actionable change.
Now you might be wondering, where do the superheroes come in? What happens to earth in the future? What kind of a planet will our children live in?
Well, the answers to those questions are in this very story. The superheroes are the children who built eco bricks, the schools that implemented green programs, the parents who decided to invest in conscious games, Amishi, Manav and countless changemakers along the way who made (and continue to make) an active choice to be a part of the climate fight! As for the future, we’re absolutely positive that our children and grandchildren will be able to live in a beautiful world, with wide rivers, lush forests and fertile land. So now that you know our origin story, are you ready to join the league?`;
const contactContent = `Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.`;

let posts = [];
const app = express();
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://chanduchowdary30:Chandu123@cluster0.vuayqpl.mongodb.net/blogDB");

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = new mongoose.model("Post",postSchema);



app.get("/",async function(req,res){
  posts = await Post.find({});
  //URL: https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Pun,Spooky,Christmas?type=single
  const response = await axios.get("https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Pun,Spooky,Christmas?type=single");

  res.render("home.ejs",{home:homeStartingContent,posts:posts,joke :response.data});
});
app.get("/about",(req,res)=>{
  res.render("about.ejs",{about:aboutContent});
});
app.get("/contact",(req,res)=>{
  res.render("contact.ejs",{contact:contactContent});
});
app.get("/compose",async (req,res)=>{
  const title = req.query.eletit;
  const post = await Post.findOne({_id:title});
  if(title!=null){
    res.render("compose.ejs",{post:post});
  }
  else{
    var post1={
      title:"",
      content:"",
    }
    res.render("compose.ejs",{post:post1});
  }
});
app.post("/compose",async function(req,res){

  
  console.log(req.body.postTitle);
  const temp= await Post.findOne({title:req.body.postTitle});
  if(temp==null){
    const post = new Post({
      title:req.body.postTitle,
      content: req.body.textBox
    });
   await post.save();
  }
  else{
  console.log(temp._id);
  temp.title = req.body.posTitle;
  temp.content = req.body.textBox;
  await temp.save();
  }
  res.redirect("/");
});
app.get("/posts/:postId",async function (req,res) {
  const requestedPostId = req.params.postId;
 console.log(requestedPostId);
  // const user = load.lowerCase(req.params.user);
  // console.log(load.upperFirst(user));
  let element = await Post.findOne({_id:requestedPostId});
  // posts.forEach(element => {
  //   console.log(element._id);
  //   if (element._id===requestedPostId) {
  //     res.render("post.ejs",{posTi:element.title,posTex:element.content})
  //   }
  // });
  res.render("post.ejs",{posTi:element.title,posTex:element.content});

});

app.post("/delete",async (req,res)=>{
const newid = req.body.title
await Post.deleteOne({_id:newid});
res.redirect("/");
})















app.listen(3000, function() {
  console.log("Server started on port 3000");
});
