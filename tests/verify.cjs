// Checks of content, static rendering and Java examples. No browser required.
// Run: node tests/verify.cjs
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
const {spawnSync} = require('node:child_process');
const root = path.join(__dirname, '..');
const elements = new Map();
function element(id) {
  if (!elements.has(id)) elements.set(id, {
    innerHTML:'', textContent:'', value:'', hidden:true, dataset:{},
    classList:{add(){},remove(){},toggle(){}},
    setAttribute(){},removeAttribute(){},addEventListener(){},focus(){},
    querySelectorAll(){return [];}
  });
  return elements.get(id);
}
const storage = new Map();
const ctx = vm.createContext({
  document:{getElementById:element,querySelectorAll:()=>[],addEventListener(){},title:''},
  location:{hash:''},
  window:{addEventListener(){},scrollTo(){},matchMedia:()=>({matches:false,addEventListener(){}})},
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  setTimeout:()=>1,clearTimeout(){},console
});
vm.runInContext(fs.readFileSync(path.join(root,'app.js'),'utf8'), ctx);
vm.runInContext('globalThis.api = {lessons, render, renderLab, renderReview, renderReady, state, save, escapeHTML, highlightJava, code, getNextLesson, copyCode};', ctx);
const {api} = ctx;
assert.equal(api.lessons.length,9);
assert.equal(api.lessons.reduce((n,l)=>n+l.questions.length,0),18);
const ids = new Set();
for (const lesson of api.lessons) {
  assert(!ids.has(lesson.id)); ids.add(lesson.id);
  for (const q of lesson.questions) {
    assert(q.answer >= 0 && q.answer < q.options.length);
    assert(q.why.length > 30);
  }
}
for (const route of ['inicio',...ids,'laboratorio','repaso','preparacion']) {
  ctx.location.hash='#'+route;
  api.render();
  const html=element('main').innerHTML;
  assert(html.includes('<h1>'),route+' has a heading');
  assert(!html.includes('undefined'),route+' contains no undefined data');
  assert(!html.includes('[object Object]'),route+' contains no accidental objects');
  for(const match of html.matchAll(/href="#([a-z]+)"/g)) {
    assert(['inicio','ruta','laboratorio','repaso','preparacion',...ids].includes(match[1]),'valid route '+match[1]);
  }
}
api.state.notes.base='<script>alert("test")</script>';
ctx.location.hash='#base';api.render();
assert(element('main').innerHTML.includes('&lt;script&gt;'));
assert(!element('main').innerHTML.includes('<script>alert'));
api.save();
assert.equal(JSON.parse(storage.get('java-a-tu-ritmo-v1')).notes.base,api.state.notes.base);
for(const id of ids) {api.renderReview(id);assert(element('main').innerHTML.includes('value="'+id+'" selected'));}
api.state.lab=[{name:'primero',value:1},{name:'segundo',value:10}];
api.state.labLog=['Contador primero = new Contador(1);'];api.renderLab();
assert(element('objects').innerHTML.includes('primero'));
assert(element('objects').innerHTML.includes('segundo'));
assert(element('lab-log').textContent.includes('new Contador(1)'));
for(const file of ['index.html','styles.css','app.js']) assert(fs.existsSync(path.join(root,file)));
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(html.includes('lang="es"'));
assert(html.includes('src="app.js"'));
assert(html.includes('href="styles.css"'));
// Verify pinned upstream assets and their load order, without network access.
const {createHash}=require('node:crypto');
const assets={
  'bootstrap.min.css':'sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB',
  'bootstrap.bundle.min.js':'FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI'
};
for(const [file,expected] of Object.entries(assets)){
  assert.equal(createHash('sha384').update(fs.readFileSync(path.join(root,'vendor','bootstrap',file))).digest('base64'),expected,file+' matches official asset');
  assert(html.includes(`vendor/bootstrap/${file}`));
}
assert(html.indexOf('bootstrap.min.css')<html.indexOf('styles.css'));
assert(html.indexOf('bootstrap.bundle.min.js')<html.indexOf('src="app.js"'));
assert(fs.readFileSync(path.join(root,'vendor','bootstrap','LICENSE'),'utf8').includes('MIT License'));
assert(!/class="toast"/.test(html),'custom notifications do not collide with Bootstrap Toast');
assert(element('main').innerHTML.includes('btn btn-primary'));
assert(element('main').innerHTML.includes('form-control'));
console.log('OK: local Bootstrap 5.3.8 assets, official hashes, license and integration.');
console.log('OK: all 13 routes render; 18 questions; filters, stored notes, escaping and lab rendering.');

// Compile the full Java classes actually shown in the lessons.
const decode=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
// Highlighting must preserve the exact source, including strings, comments and HTML-like input.
for(const sample of ['public class Hola { String texto = "<script> & \\"hola\\""; }','// public class 42\nint n = 12;','/* private int */\nString a = "return 12";','if (a < 3 && a > 0) return;']) {
  assert.equal(decode(api.highlightJava(sample).replace(/<[^>]+>/g,'')),sample);
}
assert(api.highlightJava('public class Hola').includes('syntax-keyword'));
assert(api.highlightJava('// public int 1').startsWith('<span class="syntax-comment">'));
const sampleCode=api.code('System.out.println("Hola");','Fragmento dentro de main','Hola');
assert(sampleCode.includes('data-copy-code'));
assert(sampleCode.includes('<samp>Hola</samp>'));
api.state.completed=[];api.state.lastLesson='clases';
assert.equal(api.getNextLesson().id,'clases','resume an unfinished visited lesson');
api.state.completed=['clases'];
assert.equal(api.getNextLesson().id,'base','do not resume a completed lesson');
api.state.completed=Array.from(ids);ctx.location.hash='#inicio';api.render();
assert(element('main').innerHTML.includes('Revisar mi preparación'));
api.state.completed=[];api.state.lastLesson='base';
for(const file of ['literata.ttf','literata-italic.ttf','source-sans-3.ttf','jetbrains-mono.ttf']) {
  const font=fs.readFileSync(path.join(root,'vendor','fonts',file));
  assert.equal(font.readUInt32BE(0),0x00010000,'valid TrueType header: '+file);
}
for(const file of ['OFL-Literata.txt','OFL-Source-Sans-3.txt','OFL-JetBrains-Mono.txt']) assert(fs.readFileSync(path.join(root,'vendor','fonts',file),'utf8').includes('SIL OPEN FONT LICENSE'));
console.log('OK: next lesson selection, finished route, safe syntax highlighting, output panels and local fonts.');
const examples=new Map();
for(const lesson of api.lessons) {
  for(const m of lesson.body.matchAll(/<pre[^>]*><code>([\s\S]*?)<\/code><\/pre>/g)) {
    const source=decode(m[1]);
    const className=source.match(/public class (\w+)/)?.[1];
    if(className) examples.set(className,source);
  }
}
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'java-a-tu-ritmo-qa-'));
for(const [name,source] of examples) fs.writeFileSync(path.join(dir,name+'.java'),source,'utf8');
const result=spawnSync('javac',['-encoding','UTF-8',...Array.from(examples.keys(),name=>name+'.java')],{cwd:dir,encoding:'utf8'});
if(result.error?.code==='ENOENT') {console.log('SKIP: javac not installed; Java examples were not compiled.');process.exitCode=0;}
else {
  assert.equal(result.status,0,result.stderr||result.error?.message);
  const run=spawnSync('java',['-cp','.', 'Main'],{cwd:dir,encoding:'utf8'});
  assert.equal(run.status,0,run.stderr);
  assert.equal(run.stdout.trim().split(/\r?\n/).length,2);
  const hello=spawnSync('java',['-cp','.', 'Hola'],{cwd:dir,encoding:'utf8'});
  assert.equal(hello.status,0,hello.stderr);
  assert(hello.stdout.includes('15'));
  const smoke=`public class Smoke {
    public static void main(String[] args) {
      Contador a = new Contador(0), b = new Contador(10);
      a.incrementar();
      if(a.getValor()!=1 || b.getValor()!=10) throw new AssertionError("independence");
      Contador alias = a; alias.incrementar();
      if(a.getValor()!=2) throw new AssertionError("alias");
      Rectangulo r = new Rectangulo(3.0,4.0);
      if(r.calcularArea()!=12.0) throw new AssertionError("area");
      Lampara l = new Lampara(); l.encender();
      if(!l.estaEncendida()) throw new AssertionError("on");
      l.apagar(); if(l.estaEncendida()) throw new AssertionError("off");
      Resena resena = new Resena(new Libro("Prueba"),"Texto");
      if(!resena.describir().equals("Prueba: Texto")) throw new AssertionError("association");
    }
  }`;
  fs.writeFileSync(path.join(dir,'Smoke.java'),smoke,'utf8');
  const compile=spawnSync('javac',['-encoding','UTF-8',...Array.from(examples.keys(),name=>name+'.java'),'Smoke.java'],{cwd:dir,encoding:'utf8'});
  assert.equal(compile.status,0,compile.stderr);
  const smokeRun=spawnSync('java',['-cp','.', 'Smoke'],{cwd:dir,encoding:'utf8'});
  assert.equal(smokeRun.status,0,smokeRun.stderr);
  console.log(`OK: ${examples.size} Java classes compiled; Main, Hola and object/state/association checks passed.`);
}
console.log('Limit: these checks do not verify browser layout or DOM interaction.');
