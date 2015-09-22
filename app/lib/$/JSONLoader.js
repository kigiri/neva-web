import get from "./get";

export default url => get(url).then(req => {
  try {
    return JSON.parse(req.responseText);
  } catch (err) {
    console.log(err.message, err.stack, err);
  }
});
