const mongoose = require("mongoose");
const Spot = require("../models/spot");

const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/lets-go", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const rArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seed = async () => {
  await Spot.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const rCity = Math.floor(Math.random() * 187);
    await new Spot({
      location: `${cities[rCity].city}, ${cities[rCity].admin_name}`,
      title: `${rArray(descriptors)}, ${rArray(places)}`,
      image: "https://source.unsplash.com/collection/3509764",
      author: "60dae4aa8aae2837ccfc72b9",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi laudantium cumque neque ut. Aut assumenda quis debitis dolorum rerum reprehenderit laudantium distinctio tempora, quas facilis eaque voluptate, doloremque? Velit, exercitationem.",
      price: (Math.random() * 100).toFixed(2),
    }).save();
  }
};
seed().then(() => {
  mongoose.connection.close();
});
