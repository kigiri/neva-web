module.exports = function(svg) {
  console.log(this.query);
  this.cacheable && this.cacheable();
  svg = svg.match(/d=("[^"]+")/)[1];
  this.value = [svg];
  return 'module.exports = '+ svg +';';
}