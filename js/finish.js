var name;
var Finish ={
	preload : function(){},
	create: function(){
		var retryBut = game.add.text(220,340,"  зАново  ",{font:"bold 24px Arial",fill:'#000000', align:'center'});
		var postBut = game.add.text(410,340,"  опубликовАть  ",{font:"bold 24px Arial",fill:'#000000', align:'center'});
		graphics=game.add.graphics(0,0);
		graphics.lineStyle(0);
		graphics.beginFill(0x4869D6,0.5);
		graphics.drawRect(retryBut.x,retryBut.y-5,retryBut.width,retryBut.height+10);
		graphics.drawRect(postBut.x,postBut.y-5,postBut.width,postBut.height+10);
		graphics.endFill();
		instruction = game.add.text(game.world.width/2,270,
			"Вы набрали\n "+score+this.whatSl(),
			{font:"bold 28px Arial",fill:'#000000', align:'center'});
		instruction.anchor.set(0.5,0.5);	
		scoresText = game.add.text(5,5,"",{font:"italic 23px Arial",fill:'#1c3956'});
		postBut.inputEnabled=true;
		retryBut.inputEnabled=true;
		postBut.events.onInputDown.add(this.wallPost,this);
		retryBut.events.onInputDown.add(function(){game.state.start("Game");},this);
		name=String(data.response.name[0].last_name+" "+data.response.name[0].first_name);
		this.setScore();
	},
	update: function(){},
	wallPost: function(){
		VK.api("wall.post", {"message": String("Мной набрано "+score+this.whatSl()+" в игре Udareniya."), "attachments": "photo-160039023_456239019"});
	},
	whatSl: function(){
		var ret="очко";
		if(Math.abs(score)==0 || Math.abs(score)>=5){
			ret="очков";
		}else if(Math.abs(score)>1 && Math.abs(score)<5){
			ret="очка";
		}
		return String(' '+ret);
	},
	setScore: function() {
			var xhr = new XMLHttpRequest();
			
			if (name.length > 25) {
				name = name.slice(0,25);
			}
			
			var json = JSON.stringify({
				name: name,
				score: score
			});
			
			xhr.open("POST","HTTPS://Bulat102.pythonanywhere.com/set_score/test",true);
			xhr.setRequestHeader("Content-type",'application/json; charset=utf-8');
			
			xhr.send(json);
			
			
			xhr.onreadystatechange = function(){
				if (xhr.readyState !=4) return;
			
				if (xhr.status != 200){
					//обработать ошибку
					alert("Ошибка " + xhr.status + ': ' + xhr.statusText);
				} else {
					// вывести результат
					alert(xhr.responseText);
					let score_table = String(xhr.responseText).slice(0,-1);
					let top_place = Number(String(xhr.responseText).slice(-1)); //выводим топовое место, если получили, если нет то 0
					
					scoresText.text = "Рекорды:\n1 " + score_table;
					
					if (Boolean(top_place)){
						scoresText.text = scoresText.text+"\n\n Ваш результат "+score+" попал на "+top_place+' место!';
					}else{
						scoresText.text = scoresText.text+"\n\n Ваш результат "+score+" не попал в топ(";
					}
				}
			}
		}
};
