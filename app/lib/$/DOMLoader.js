import get from "./get";

export default (url, header) => get(url, header).then(req =>
  (new window.DOMParser).parseFromString(req.responseText, "text/html"));
