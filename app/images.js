import loop from "event/loop";

const images = {};

function safeObjectSet(source, key, value) {
  if (source[key]) {
    return source[key]
  }
}

function setIcon(entries, type, name) {
  let i = -1;
  while (++i < entries.length) {
    if (images[entries[i]]) {
      images[entries[i]][type] = name;
    } else {
      images[entries[i]] = { [type]: name }
    }
  }
}

function setData(data, type) {
  const keys = Object.keys(data);
  let i = -1;
  while (++i < keys.length) {
    setIcon(data[keys[i]], type, keys[i]);
  }
  return false;
}

fetch("http://neva.cdenis.net/json/images.json")
.then(r => r.json()).then(imagesData => {
  loop.add(event => {
    loop.add(event => setData(imagesData.models, "model"));
    return setData(imagesData.icons, "icon");
  })
})



const emptyEntry = { icon: "inv_misc_questionmark" }
images.get = entry => images[entry] ? images[entry] : emptyEntry;

const urlBases = [
  "//wowimg.zamimg.com/images/wow/icons/",
  "//cdn.openwow.com/wotlk/icons/",
];

images.getIcon = (entry, size) => {
  return urlBases[entry % 2] + (size || "small")
    +"/"+ images.get(entry).icon +".jpg";
}

images.toCss = img => img ? "url('"+ img +"')" : "";

images.getModel = entry => {
  const model = images.get(entry).model;
  return model ? "//wow.zamimg.com/modelviewer/thumbs/item/"+ model +".png" : "";
}

export default images;
