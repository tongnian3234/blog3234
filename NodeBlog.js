const express = require('express');
const path = __dirname;
const server = express();
const fs = require("fs");
const markdown = require('markdown').markdown;
server.get("/",function(req, res) { //主页
	res.set('Transfer-Encoding', 'chunked');
	res.set('Content-Type', 'text/html');
	res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
	fs.readFile(path + '/header.html',function(err,data){
		res.write(data.toString().replace("[PandaTitle]","童年的博客-山河犹在，故人已逝。")+'\r\n');
		fs.readFile(path + '/list.html',function(err,data){
			res.write(data.toString().replace("[PandaList]",list("1")).replace("[PandaPage]",'<ul class="pager"><li><a href="javascript:alert('+"'别翻了,再翻翻车了!'"+')">Previous</a></li><li><a href="/page/2">Next</a></li></ul>'));
			res.write('\r\n');
			res.end();
		});
	});
});

server.get("/post/*",function(req, res) {
	res.set('Content-Type', 'text/html');
	res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
	let wget = toget(req.path.toString(),"post/","/");
	if(fs.existsSync(path + '/md/' + wget + '.md')){
		res.set('Transfer-Encoding', 'chunked');
		let ccc = fs.readFileSync(path + '/md/' + wget + '.md').toString().replace("<--more-->","");
		fs.readFile(path + '/header.html',function(err,data){
		res.write(data.toString().replace("[PandaTitle]",toget(ccc,"##","\n")+"-童年的博客")+'\r\n');
		fs.readFile(path + '/post.html',function(err,data){
			res.write(data.toString().replace("[PandaPost]",markdown.toHTML(ccc)));
			res.write('\r\n');
			res.end();
			});
		});
	}else{
		res.status(404).send(fs.readFileSync(path + '/404.html').toString());
	}
	
});

server.get("/page/*",function(req, res) {
	res.set('Transfer-Encoding', 'chunked');
	res.set('Content-Type', 'text/html');
	res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
	fs.readFile(path + '/header.html',function(err,data){
		res.write(data.toString().replace("[PandaTitle]","童年的博客-山河犹在，故人已逝。")+'\r\n');
		let num = toget(req.path.toString(),"page/","/");
		fs.readFile(path + '/list.html',function(err,dataA){
			files = fs.readdirSync(path+'/md/');
			let t1 = num - 1;
			let cc = files.length - 3 - t1 * 5;
			let next = parseInt(num) + 1;
			let before = parseInt(num) - 1;
			if(num < 2){
				res.write(dataA.toString().replace("[PandaList]",list(num)).replace("[PandaPage]",'<ul class="pager"><li><a href="javascript:alert('+"'别翻了,再翻翻车了!'"+')">Previous</a></li><li><a href="'+next.toString()+'">Next</a></li></ul>'));
			}else if(cc < 6){
				res.write(dataA.toString().replace("[PandaList]",list(num)).replace("[PandaPage]",'<ul class="pager"><li><a href="'+before.toString()+'">Previous</a></li><li><a href="javascript:alert('+"'别翻了,再翻翻车了!'"+')">Next</a></li></ul>'));
			}else{
				res.write(dataA.toString().replace("[PandaList]",list(num)).replace("[PandaPage]",'<ul class="pager"><li><a href="'+before.toString()+'">Previous</a></li><li><a href="'+next.toString()+'">Next</a></li></ul>'));
			}
			res.write('\r\n');
			res.end();
		});
	});
});

server.get("/*",function(req, res) { //静态设置
	res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    fs.readFile(path + '/' + req.path.toString(),function(err, data) {
        if (!err) {
            res.set('Content-Type', '*/*').send(data);
        } else {
            res.status(404).send(fs.readFileSync(path + '/404.html').toString());
        }
    });
});

server.listen(80,function() {
    console.log('Bingo!');
});

function list(aa){
    let t3 = "";
	let files = fs.readdirSync(path+'/md/');
	let t1 = aa - 1;
	let ca = files.length - 3 - t1 * 5;
	for (let i = 0; i < 5; i++) {
		let temp = ca - i;
		if(temp > 0){
			let a = fs.readFileSync(path + '/md/' + temp.toString() + '.md');
			t3 = t3 + '<div id="apple"><a href="/post/' + temp.toString()+ '">' + markdown.toHTML(a.toString().slice(0, a.toString().indexOf("<--more-->"))) + '</div></a><hr>';
		}
	}
	return t3;
}
function toget(Text,Before,After){ 
    let b = Text.split(Before);
    let c = b.slice(b.length - 1, b.length).toString(String).split(After);
	return c.slice(0, 1)[0].toString();
}