const edge = 8;
function Snake(scene){
			  this.scene = scene;
			  this.dir = [0,1,0];
			  this.cube = new Array();
			  this.body = new Array(3)
			  this.body[0] = [0,0,-8];
			  this.body[1] = [0,-1,-8];
			  this.body[2] = [0,-2,-8];
			  this.draw();
			  this.eat = new BABYLON.Sound("Violons", "sounds/eat.wav", scene, null, { loop: false, autoplay: false });
			}
			
			Snake.prototype.move = function(eggs){
				//判斷尾巴有沒有蛋蛋，有就吃掉
				for(var i = 0;i<eggs.array.length;i++){
					if(this.body[this.body.length-1][0] == eggs.array[i].position[0] &&
						this.body[this.body.length-1][1] == eggs.array[i].position[1] &&
						this.body[this.body.length-1][2] == eggs.array[i].position[2]){
						var length = this.body.length;
						this.body[length] = [0,0,0];
						
						//畫出方塊
						var materialSnake = new BABYLON.StandardMaterial("snake", this.scene);
						materialSnake.diffuseColor = new BABYLON.Color3(0.3, 0.9, 0.3);//Green
						this.cube[length] = BABYLON.Mesh.CreateBox("snake",0.99,this.scene);
						this.cube[length].material = materialSnake;
						this.cube[length].position = new BABYLON.Vector3(this.body[length][0], this.body[length][1], this.body[length][2]);
						this.cube[length].actionManager = new BABYLON.ActionManager(this.scene);
						eggs.reborn(i);
						for(var i = 0 ; i < eggs.array.length ; i++){
							this.cube[length].actionManager.registerAction(new BABYLON.SetValueAction(
							{ trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: eggs.array[i].sphere },
							this.cube[length], "scaling", new BABYLON.Vector3(1.2, 1.2, 1.2)));							
							this.cube[length].actionManager.registerAction(new BABYLON.SetValueAction(
							{ trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: eggs.array[i].sphere },
							this.cube[length], "scaling", new BABYLON.Vector3(1, 1, 1)));
						}
					}
				}
				//判斷有沒有碰到身體的其他部位
				for(var i = 1;i < this.body.length ; i++){
					if(this.body[0][0] == this.body[i][0] &&
						this.body[0][1] == this.body[i][1] &&
						this.body[0][2] == this.body[i][2]){
							for(var i = 0;i < this.cube.length ; i++){
								var materialSnake = new BABYLON.StandardMaterial("snake", this.scene);
								materialSnake.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);//Green
								materialSnake.specularColor = new BABYLON.Color3(1, 1, 1);//Green
								this.cube[i].material = materialSnake;
								this.cube[i].scaling=new BABYLON.Vector3(0.8, 0.8, 0.8);
							}
							return 0;
						}
				}
				//先把所有後面的位置都往前取代
				for(var i = this.body.length-1;i>0;i--){
					for(var j = 0;j<this.body[i].length;j++){
							this.body[i][j]=this.body[i-1][j];
							}
				}
				//正面上方的邊
				if(this.body[0][1]==edge && this.body[0][2]==-1*edge){
					if(this.dir[1]==1){this.dir = [0,0,1];}
					else if(this.dir[2]==-1){this.dir = [0,-1,0];}
				}
				//正面下方的邊
				else if(this.body[0][1]==-1*edge && this.body[0][2]==-1*edge){
					if(this.dir[1] == -1){this.dir = [0,0,1];}
					else if(this.dir[2] ==-1){this.dir = [0,1,0];}
				}
				//正面左方的邊
				else if(this.body[0][0]==-1*edge && this.body[0][2]==-1*edge){
					if(this.dir[0] ==-1){this.dir = [0,0,1];}
					else if(this.dir[2] ==-1){this.dir = [1,0,0];}
				}
				//正面右方的邊
				else if(this.body[0][0]==edge && this.body[0][2]==-1*edge){
					if(this.dir[0] ==1){this.dir = [0,0,1];}
					else if(this.dir[2] == -1){this.dir = [-1,0,0];}
				}
				//背面上方的邊
				else if(this.body[0][1]==edge && this.body[0][2]==edge){
					if(this.dir[1] ==1){this.dir = [0,0,-1];}
					else if(this.dir[2] ==1){this.dir = [0,-1,0];}
				}
				//背面下方的邊
				else if(this.body[0][1]==-1*edge && this.body[0][2]==edge){
					if(this.dir[1] ==-1){this.dir = [0,0,-1];}
					else if(this.dir[2] ==1){this.dir = [0,1,0];}
				}
				//背面左方的邊
				else if(this.body[0][0]==-1*edge && this.body[0][2]==edge){
					if(this.dir[0] == -1){this.dir = [0,0,-1];}
					else if(this.dir[2] == 1){this.dir = [1,0,0];}
				}
				//背面右方的邊
				else if(this.body[0][0]==edge && this.body[0][2]==edge){
					if(this.dir[0] == 1){this.dir = [0,0,-1];}
					else if(this.dir[2] == 1){this.dir = [-1,0,0];}
				}
				//左上邊
				else if(this.body[0][0]==-1*edge && this.body[0][1]==edge){
					if(this.dir[0] == -1){this.dir = [0,-1,0];}
					else if(this.dir[1] == 1){this.dir = [1,0,0];}
				}
				//左下邊
				else if(this.body[0][0]==-1*edge && this.body[0][1]==-1*edge){
					if(this.dir[0] == -1){this.dir = [0,1,0];}
					else if(this.dir[1] == -1){this.dir = [1,0,0];}
				}
				//右上邊
				else if(this.body[0][0]==edge && this.body[0][1]==edge){
					if(this.dir[0] == 1){this.dir = [0,-1,0];}
					else if(this.dir[1] == 1){this.dir = [-1,0,0];}
				}
				//右下邊
				else if(this.body[0][0]==edge && this.body[0][1]==-1*edge){
					if(this.dir[0] == 1){this.dir = [0,1,0];}
					else if(this.dir[1] == -1){this.dir = [-1,0,0];}
				}
				
				for(var i = 0;i<eggs.array.length;i++){
					//蛇吃蛋音效
					if(this.body[0][0] + this.dir[0] == eggs.array[i].position[0] &&
						this.body[0][1] + this.dir[1] == eggs.array[i].position[1] &&
						this.body[0][2] + this.dir[2] == eggs.array[i].position[2]){
							this.eat.play();
						}
				}
				//
				this.body[0][0]+=this.dir[0];
				this.body[0][1]+=this.dir[1];
				this.body[0][2]+=this.dir[2];
				
				//set cubes
				for(var i =0;i<this.body.length;i++){
					this.cube[i].position = new BABYLON.Vector3(this.body[i][0], this.body[i][1], this.body[i][2]);
				}
				return true; //game playing
			}
			Snake.prototype.action = function(act){
				if(Math.abs(this.body[0][0])==edge&&Math.abs(this.body[0][1])==edge 
					||	Math.abs(this.body[0][0])==edge&&Math.abs(this.body[0][2])==edge 
					|| 	Math.abs(this.body[0][1])==edge&&Math.abs(this.body[0][2])==edge)return;
				if(this.body[0][1]==edge){
					switch(act) {
						case 'w':
							if(this.dir[2]!=-1)this.dir=[0,0,1];
							break;
						case 'a':
							if(this.dir[0]!=1)this.dir=[-1,0,0];
							break;
						case 's':
							if(this.dir[2]!=1)this.dir=[0,0,-1];
							break;
						case 'd':
							if(this.dir[0]!=-1)this.dir=[1,0,0];
							break;
					}
				}else if(this.body[0][1]==-1*edge){
					switch(act) {
						case 'w':
							if(this.dir[2]!=1)this.dir=[0,0,-1];
							break;
						case 'a':
							if(this.dir[0]!=1)this.dir=[-1,0,0];
							break;
						case 's':
							if(this.dir[2]!=-1)this.dir=[0,0,1];
							break;
						case 'd':
							if(this.dir[0]!=-1)this.dir=[1,0,0];
							break;
					}
				}else{
					if(this.body[0][2]==-1*edge){
						switch(act) {
							case 'w':
								if(this.dir[1]!=-1)this.dir=[0,1,0];
								break;
							case 'a':
								if(this.dir[0]!=1)this.dir=[-1,0,0];
								break;
							case 's':
								if(this.dir[1]!=1)this.dir=[0,-1,0];
								break;
							case 'd':
								if(this.dir[0]!=-1)this.dir=[1,0,0];
								break;
						}
					}else if(this.body[0][0]==edge){
						switch(act) {
							case 'w':
								if(this.dir[1]!=-1)this.dir=[0,1,0];
								break;
							case 'a':
								if(this.dir[2]!=1)this.dir=[0,0,-1];
								break;
							case 's':
								if(this.dir[1]!=1)this.dir=[0,-1,0];
								break;
							case 'd':
								if(this.dir[2]!=-1)this.dir=[0,0,1];
								break;
						}
					}else if(this.body[0][0]==-1*edge){
							switch(act) {
							case 'w':
								if(this.dir[1]!=-1)this.dir=[0,1,0];
								break;
							case 'a':
								if(this.dir[2]!=-1)this.dir=[0,0,1];
								break;
							case 's':
								if(this.dir[1]!=1)this.dir=[0,-1,0];
								break;
							case 'd':
								if(this.dir[2]!=1)this.dir=[0,0,-1];
								break;
						}
					}else if(this.body[0][2]==edge){
						switch(act) {
							case 'w':
								if(this.dir[1]!=-1)this.dir=[0,1,0];
								break;
							case 'a':
								if(this.dir[0]!=-1)this.dir=[1,0,0];
								break;
							case 's':
								if(this.dir[1]!=1)this.dir=[0,-1,0];
								break;
							case 'd':
								if(this.dir[0]!=1)this.dir=[-1,0,0];
								break;
						}
					}
				}
			}
			Snake.prototype.draw = function(){
				var materialSnake = new BABYLON.StandardMaterial("snake", this.scene);
				materialSnake.diffuseColor = new BABYLON.Color3(0.3, 0.9, 0.3);//Green
				for(var i =0;i<this.body.length;i++){
					this.cube[i]= BABYLON.Mesh.CreateBox("snake",0.99,this.scene);
					this.cube[i].material = materialSnake;
					this.cube[i].position = new BABYLON.Vector3(this.body[i][0], this.body[i][1], this.body[i][2]);
					this.cube[i].actionManager = new BABYLON.ActionManager(this.scene);
				}
				var materialSnakeHead = new BABYLON.StandardMaterial("snake", this.scene);
				materialSnakeHead.diffuseColor = new BABYLON.Color3(0.0, 0.8, 0.1);//Green
				this.cube[0].material = materialSnakeHead;
			}
			