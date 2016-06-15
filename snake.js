const edge = 8;
function Snake(scene){
			  this.isDead=false;
			  this.energy = 0;
			  this.scene = scene;
			  this.dir = [0,1,0];
			  this.cube = new Array();
			  this.body = new Array(3)
			  this.body[0] = [0,0,-8];
			  this.body[1] = [0,-1,-8];
			  this.body[2] = [0,-2,-8];
			  this.draw();
			  this.eat = new BABYLON.Sound("Violons", "sounds/eat.wav", scene, null, { loop: false, autoplay: false });
			  this.dead = new BABYLON.Sound("Violons", "sounds/dead.wav", scene, null, { loop: false, autoplay: false });
			}
			
			Snake.prototype.move = function(eggs){
				if(this.isDead)return 0;
				if(this.energy == 100){this.die(); return 0;} 

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
				//下一步有沒有碰到身體的其他部位
				for(var i = 1;i < this.body.length ; i++){
					if(this.body[0][0] + this.dir[0] == this.body[i][0] &&
						this.body[0][1] + this.dir[1] == this.body[i][1] &&
						this.body[0][2] + this.dir[2] == this.body[i][2]){
							this.die();
							return 0;
						}
				}
				for(var i = 0;i<eggs.array.length;i++){
					//蛇吃蛋音效
					if(this.body[0][0] + this.dir[0] == eggs.array[i].position[0] &&
						this.body[0][1] + this.dir[1] == eggs.array[i].position[1] &&
						this.body[0][2] + this.dir[2] == eggs.array[i].position[2]){
							this.eat.play();
							this.energy -= 30;
							if(loser.energy < 0)loser.energy = 0;
						}
				}
				//
				this.body[0][0]+=this.dir[0];
				this.body[0][1]+=this.dir[1];
				this.body[0][2]+=this.dir[2];
				this.energy +=1; //能量消耗
				$(".timeBlock").css("height", this.energy+"%"); //能量條下降
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
			Snake.prototype.die = function(){
					this.dead.play();
					this.particleSystem = new Array();
				for(var i = 0;i < this.cube.length ; i++){
					this.cube[i].scaling=new BABYLON.Vector3(0.7, 0.7, 0.7);
					this.dir = [0,0,0];
					//寫粒子
					 this.particleSystem[i] = new BABYLON.ParticleSystem("particles", 100, scene);

					//粒子的纹理
					this.particleSystem[i].particleTexture = new BABYLON.Texture("image/green.png", scene);

					// 粒子的來源
					this.particleSystem[i].emitter = this.cube[i]; // 從這塊方塊發射
					this.particleSystem[i].minEmitBox = new BABYLON.Vector3(-1, 0, 0); //最小发射
					this.particleSystem[i].maxEmitBox = new BABYLON.Vector3(1, 0, 0); //最大发射(基于轴的延伸，建议改这里的数值体验)

					// 粒子颜色
					this.particleSystem[i].color1 = new BABYLON.Color4(0.1, 0.8, 0.4, 1.0);
					this.particleSystem[i].color2 = new BABYLON.Color4(0.1, 0.5, 0.1, 1.0);
					this.particleSystem[i].colorDead = new BABYLON.Color4(0, 0.2, 0.0, 0.0);

					// 粒子大小区间
					this.particleSystem[i].minSize = 0.1;
					this.particleSystem[i].maxSize = 0.5;

					// 粒子寿命
					this.particleSystem[i].minLifeTime = 0.3;
					this.particleSystem[i].maxLifeTime = 1.0;

					// 发射率
					this.particleSystem[i].emitRate = 1000;

					// 混合模式 : BLENDMODE_ONEONE(基于某地的混合模式), or BLENDMODE_STANDARD(标准的混合模式)
					this.particleSystem[i].blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

					// 粒子重力
					this.particleSystem[i].gravity = new BABYLON.Vector3(0, -9.81, 0);

					// 粒子喷射方向
					this.particleSystem[i].direction1 = new BABYLON.Vector3(Math.random()*10, Math.random()*10,Math.random()*10);
					this.particleSystem[i].direction2 = new BABYLON.Vector3(Math.random()*10, Math.random()*10,Math.random()*10);

					// 角速度，弧度
					this.particleSystem[i].minAngularSpeed = 0;
					this.particleSystem[i].maxAngularSpeed = Math.PI;

					// 速度
					this.particleSystem[i].minEmitPower = 1;
					this.particleSystem[i].maxEmitPower = 3;
					this.particleSystem[i].updateSpeed = 0.005;
					console.log(this.particleSystem[i]);
					// 开始粒子系统
					this.particleSystem[i].start();					
				}
				this.isDead = true;				
			}
			