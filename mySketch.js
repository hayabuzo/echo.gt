var canvas;

function setup() {
	
  canvas = createCanvas(800, 600);
	centerCanvas();
  canvas.drop(addimg);
	
	background(200);
	
	textAlign(CENTER,CENTER);
	text('Open or drag and drop an image here.',width/2,height/2);
	ellipseMode(CENTER);
	for(let i = 0; i<10; i++) {
		noFill().stroke(150+i*5).ellipse(width/2,height/2,300+i*20,300+i*20);
	}
	
	cnv = {};
	
	file_input = createFileInput(addimg);  
	file_input.style('font-family: monospace; font-size: 20px; text-align: left; background-color: black; color: white');
	
	gui = {};
	
  gui.shf = createButton('Shift');
	gui.shf.style('font-family: monospace; font-size: 20px; ');
  gui.shf.mousePressed(shift);
	
  gui.tf = createElement('textarea', '');
	gui.tf.style('text-align: center; padding: 25px; white-space: pre;');
	gui.tf.attribute('readonly','');
	
  gui.inW = createInput(10);
  gui.inW.size(50);
	gui.inWP = createP('W'); 
	gui.inW.changed(generate);
	gui.inW.attribute('title','Width of text matrix');
	
  gui.inH = createInput(20);
  gui.inH.size(50);
	gui.inHP = createP('H');
	gui.inH.changed(generate);
	gui.inH.attribute('title','Height of text matrix');
	
  gui.inU = createInput(10000);
  gui.inU.size(50);
	gui.inUP = createP('U');
	gui.inU.changed(generate);
	gui.inU.attribute('title','Unicode symbols range');
	
	gui.inS = createInput(19968);
  gui.inS.size(50);
	gui.inSP = createP('S');
	gui.inS.changed(generate);
	gui.inS.attribute('title','Shift of unicode range');
	
	gui.inB = createInput(0);
  gui.inB.size(50);
	gui.inBP = createP('B');
	gui.inB.changed(generate);
	gui.inB.attribute('title','Border of image to be ignored');	
	
	gui.inG = createInput(5);
  gui.inG.size(50);
	gui.inGP = createP('G');
	gui.inG.changed(generate);
	gui.inG.attribute('title','Group symbols');	

	gui.prP = createP('pre/post-fix'); 
	
	gui.pre = createInput('"');
	gui.pre.changed(generate);
	gui.pre.attribute('title','Prefix');	
	
	gui.pst = createInput('".');
	gui.pst.changed(generate);
	gui.pst.attribute('title','Postfix');	
	
  gui.lang = createSelect();
	gui.lang.size(55);
  gui.lang.option('en');
  gui.lang.option('ru');
	gui.lang.selected('ru');
	gui.lang.changed(generate);
	gui.lang.attribute('title','Language of translation');
	
  gui.bs = createButton('Save');
  gui.bs.mousePressed(fs);
	
  gui.bl = createButton('Load');
  gui.bl.mousePressed(fl);
	
  gui.br = createButton('Reset');
  gui.br.mousePressed(fr);
	
	gui.refH = createA('https://www.hayabuzo.me', 'hayabuzo.me','_blank');
	gui.refH.style('color: RGB(150,150,150);');
	
	for (let i in gui) { gui[i].style('visibility:hidden'); }	
	setpos();
	fl();

}

function setpos() {
	
	cnv.x = (windowWidth-width)/2;    	if (cnv.x<0) cnv.x = 0;
	cnv.y = (windowHeight-height)/2;    if (cnv.y<0) cnv.y = 0;
	
	file_input.position(cnv.x+20, cnv.y+20).size(350,30);
	gui.shf.position(cnv.x+20, cnv.y+60).size(350,30);
	gui.tf.position(cnv.x+150,cnv.y+100).size(205,400);	// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< size(165,360);
	
	let ip = 125;
	gui.inW.position(cnv.x+55, cnv.y+ip);  ip += 25;
	gui.inH.position(cnv.x+55, cnv.y+ip);  ip += 25;
	gui.inU.position(cnv.x+55, cnv.y+ip);  ip += 25;
	gui.inS.position(cnv.x+55, cnv.y+ip);  ip += 25;
	gui.inB.position(cnv.x+55, cnv.y+ip);  ip += 25;
	gui.inG.position(cnv.x+55, cnv.y+ip);  ip += 8; 
	
	gui.prP.position(cnv.x+35, cnv.y+ip); ip += 25; ip += 15;
	
	gui.pre.position(cnv.x+35, cnv.y+ip).size(30);  
	gui.pst.position(cnv.x+75, cnv.y+ip).size(30);  ip += 25; ip += 25;
	
	gui.bs.position(cnv.x+55, cnv.y+ip).size(55,20); ip += 25;
	gui.bl.position(cnv.x+55, cnv.y+ip).size(55,20); ip += 25;
	gui.br.position(cnv.x+55, cnv.y+ip).size(55,20); ip += 25;
	gui.lang.position(cnv.x+55, cnv.y+ip); ip += 25; 
	
	gui.refH.position(cnv.x+30,cnv.y+560);
	
	if(typeof refGoogle !== 'undefined') refGoogle.position(cnv.x+200,cnv.y+525);	
	if(typeof refYandex !== 'undefined') refYandex.position(cnv.x+200,cnv.y+555);	
	
  gui.inWP.position(gui.inW.x-20,gui.inW.y-14);
  gui.inHP.position(gui.inH.x-20,gui.inH.y-14);
  gui.inUP.position(gui.inU.x-20,gui.inU.y-14);
  gui.inSP.position(gui.inS.x-20,gui.inS.y-14);
  gui.inBP.position(gui.inB.x-20,gui.inB.y-14);
  gui.inGP.position(gui.inG.x-20,gui.inG.y-14);
	
}

function fr() {
	gui.inW.value(10);
	gui.inH.value(20);
  gui.inU.value(10000);
	gui.inS.value(19968);
	gui.inG.value(5);
	gui.inB.value(0);
	gui.pre.value('"');
	gui.pst.value('".');
	gui.lang.selected('ru');
	generate();
}

function fs() {
	let mem = {};
	mem.inW = gui.inW.value();
	mem.inH = gui.inH.value();
  mem.inU = gui.inU.value();
	mem.inS = gui.inS.value();
	mem.inG = gui.inG.value();
	mem.inB = gui.inB.value();
	mem.pre = gui.pre.value();
	mem.pst = gui.pst.value();
	mem.lang= gui.lang.value();
	storeItem('gui_profile', mem);
}

function fl() {
	let mem = getItem('gui_profile');
	if (mem != null) {
		gui.inW.value(mem.inW );
		gui.inH.value(mem.inH );
  	gui.inU.value(mem.inU );
		gui.inS.value(mem.inS );
		gui.inG.value(mem.inG );
		gui.inB.value(mem.inB );
		gui.pre.value(mem.pre );
		gui.pst.value(mem.pst );
		gui.lang.selected(mem.lang);
	  if(typeof img !== 'undefined') generate();
	}
}

function shift() {
	gui.inS.value(int(gui.inS.value())+1); // gui.inS.value(int(random(19968,40959-int(gui.inU.value()))));
	generate();
	document.getElementById('gLink').click();
}

function generate() {
	
	drawtext();
	
	if(typeof refGoogle !== 'undefined') refGoogle.remove();
	refGoogle = createA('https://translate.google.com/?sl=auto&tl='+gui.lang.value()+'&text='+a+'&op=translate', 'Google Translate', '_blank');
	refGoogle.position(cnv.x+200,cnv.y+525);	
	refGoogle.style('font-size: 18px;');
  refGoogle.id('gLink');
	
	if(typeof refYandex !== 'undefined') refYandex.remove();
	refYandex = createA('https://translate.yandex.ru/?lang=zh-'+gui.lang.value()+'&text='+a, 'Yandex Translate', '_blank');
	refYandex.position(cnv.x+200,cnv.y+555);	
	refYandex.style('font-size: 18px;');

}

function addimg(file) {							
  if (file.type === 'image') img = loadImage(file.data, img => { 
		for (let i in gui) { gui[i].style('visibility:visible'); }	
		generate();
		document.getElementById('gLink').click();
	});
}

function drawtext() {
	background(245);
	image(img,400,25,375,550); 
	image(iml,15,480); 
	textSize(20).textAlign(CENTER,CENTER).fill(255,50,0).stroke(255);
	let w = int(gui.inW.value())-1;
	let h = int(gui.inH.value())-1;
	let u = int(gui.inU.value());
	let s = int(gui.inS.value());
	let b = int(gui.inB.value())/100;
	let e = int(gui.inG.value());
	let pre = gui.pre.value();
	let pst = gui.pst.value();
	a = ''; gui.tf.value('');
	for (y = 0; y<= h; y++ ) {
		for (x = 0; x<= w; x++ ) {
			if(x==0 && y!=0) { a += '%0A'; gui.tf.value(gui.tf.value()+char(10)); }
			if(x==0) a += pre;
			let c = img.get(map(x,0,w,img.width*b,img.width-1-img.width*b),map(y,0,h,img.height*b,img.height-1-img.height*b));
			let ch = map(red(c)*100+green(c)*10+blue(c),0,28305,s,s+u);
			ch = String.fromCharCode(floor(ch));
			text(ch,
					 400+map(x,0,w,375*b,375-375*b),
					 25 +map(y,0,h,550*b,550-550*b));
			a += ch;
			gui.tf.value(gui.tf.value()+ch);
			if(e>0 && x%e==e-1 && x!=w) { a += '%20'; gui.tf.value(gui.tf.value()+' '); }
			if(x==w) a += pst;
		}
	}
	//gui.tf.value(a.replace(/%0A/g, char(10)).replace(/%20/g, ' '));
}

function preload() { iml = loadImage('logo79.jpg'); }

function windowResized() { 
	centerCanvas();
	setpos(); 
}

function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas.position(x, y);
}

p5.disableFriendlyErrors = true;
 
// CJK Unified Ideographs                  4E00-9FFF    19968-40959                Common
