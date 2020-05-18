export default (req, res) => {
    console.log(req);
    console.log(req.files);
    console.log(res);
    res.send({ resp: "TEST Response" });
  };
  