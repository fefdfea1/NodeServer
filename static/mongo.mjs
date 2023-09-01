const fetch = async () => {
  const data = await axios.get("/api/offices/1");
  console.log(data);
};

fetch();
