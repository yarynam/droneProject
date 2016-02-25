var wp1 = new Waypoint({
        element: document.getElementById('vis'),
        handler: function(direction){


var chartwidth = $("#vis").width();
var docHeight = $( window ).height();
var docWidth = $( window ).width();





if (docWidth > 500 ) {

   (function() {
     var BeeChart, root,
       __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

     BeeChart = (function() {
       function BeeChart(data) {
         this.hide_details = __bind(this.hide_details, this);
         this.show_details = __bind(this.show_details, this);
         this.hide_cars = __bind(this.hide_cars, this);
         this.display_cars = __bind(this.display_cars, this);
         this.move_towards_car = __bind(this.move_towards_car, this);
         this.display_by_car = __bind(this.display_by_car, this);
         this.hide_flats = __bind(this.hide_flats, this);
         this.display_flats = __bind(this.display_flats, this);
         this.move_towards_flat = __bind(this.move_towards_flat, this);
         this.display_by_flat = __bind(this.display_by_flat, this);
         this.hide_years = __bind(this.hide_years, this);
         this.display_years = __bind(this.display_years, this);
         this.move_towards_year = __bind(this.move_towards_year, this);
         this.display_by_year = __bind(this.display_by_year, this);
         this.move_towards_center = __bind(this.move_towards_center, this);
         this.display_group_all = __bind(this.display_group_all, this);
         this.start = __bind(this.start, this);
         this.create_vis = __bind(this.create_vis, this);
         this.create_nodes = __bind(this.create_nodes, this);
         var max_amount;
         this.data = data;
         this.width = chartwidth;
         this.height = 600;
         this.tooltip = CustomTooltip("gates_tooltip", 240);
         this.center = {
           x: this.width / 2,
           y: this.height / 2.1
         };
         this.centers = {
           "superlow": {
             x: this.width / 2,
             y: this.height * 5
           },
           "low": {
             x: this.width / 3.5,
             y: this.height /2.2
           },
           "medium": {
             x: 2 * this.width / 4.1,
             y: this.height / 2.1
           },
           "high": {
             x: 2 * this.width / 2.8,
             y: this.height / 2.1
           }
         };
         this.layout_gravity = -0.03;
         this.damper = 0.07;
         this.vis = null;
         this.nodes = [];
         this.force = null;
         this.circles = null;
         this.fill_color = d3.scale.ordinal().domain(["superlow","low", "medium", "high"]).range(["#d84b2a", "#beccae", "#7aa25c"]);
         max_amount = d3.max(this.data, function(d) {
           return parseInt(d.total_amount);
         });
         //this.radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([5, 10]);
         this.create_nodes();
         this.create_vis();
       }

       BeeChart.prototype.create_nodes = function() {
         this.data.forEach((function(_this) {
           return function(d) {
             var node;
             node = {
               id: d.id,
               radius: 7,
               salary: d.monthly_salary,
               position: d.position,
               name: d.name,
               org: d.position,
               group: d.group,
               car: d.group_car,
               car_price: d.all_cars_sum_uah_mln,
               flat:d.group_flat,
               year:d.group_years,
               car_years: d.car_years,
               estate: d.all_estate,
               x: Math.random() * 900,
               y: Math.random() * 800
             };
             return _this.nodes.push(node);
           };
         })(this));
       };


       BeeChart.prototype.create_vis = function() {
         var that;
         this.vis = d3.select("#vis").append("svg").attr("width", this.width).attr("height", this.height).attr("id", "svg_vis");
         this.circles = this.vis.selectAll("image").data(this.nodes, function(d) {
           return d.id;
         });
         that = this;
         this.circles
         .enter()
         .append("image")
         .attr('class', 'beenode')
         .attr("xlink:href", function(d) {
           if (d.group == "суди")  {return "https://dl.dropboxusercontent.com/u/82823005/beeproject/mosquito.svg"}
           else if  (d.group == "МВС") {return "https://dl.dropboxusercontent.com/u/82823005/beeproject/mosquito2.svg"}
           else {return "https://dl.dropboxusercontent.com/u/82823005/beeproject/mosquito3.svg"}
         })
         .attr("x", this.width * Math.random())
         .attr("y", this.height * Math.random())
         .attr("width", 20)
         .attr("height", 20)
         .attr("id", function(d) {
           return "Bee_" + d.id;
         }).on("mouseover", function(d, i) {
           return that.show_details(d, i, this);
         }).on("mouseout", function(d, i) {
           return that.hide_details(d, i, this);
         }).on('click', function(d, i) {
            window.location.href = "http://declarations.com.ua/declaration/" + d.id;
            });
       };

       BeeChart.prototype.charge = function(d) {
         return -Math.pow(d.radius, 2.0) / 8;
       };

       BeeChart.prototype.start = function() {
         return this.force = d3.layout.force().nodes(this.nodes).size([this.width, this.height]);
       };

       BeeChart.prototype.display_group_all = function() {
         this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function(_this) {
           return function(e) {
             return _this.circles.each(_this.move_towards_center(e.alpha)).attr("x", function(d) {
               return d.x;
             }).attr("y", function(d) {
               return d.y;
             });
           };
         })(this));
         this.force.start();
         return this.vis.selectAll(".cars, .flats, .years").remove();
       };

       BeeChart.prototype.move_towards_center = function(alpha) {
         return (function(_this) {
           return function(d) {
             d.x = d.x + (_this.center.x - d.x) * (_this.damper + 0.02) * alpha;
             return d.y = d.y + (_this.center.y - d.y) * (_this.damper + 0.02) * alpha;
           };
         })(this);
       };

       BeeChart.prototype.display_by_car = function() {
         this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function(_this) {
           return function(e) {
             return _this.circles.each(_this.move_towards_car(e.alpha)).attr("x", function(d) {
               return d.x;
             }).attr("y", function(d) {
               return d.y;
             });
           };
         })(this));
         this.force.start();
         return this.display_cars();
       };

       BeeChart.prototype.move_towards_car = function(alpha) {
         return (function(_this) {
           return function(d) {
             var target;
             target = _this.centers[d.car];
             d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 1.1;
             return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 1.1;
           };
         })(this);
       };

       BeeChart.prototype.display_cars = function() {
         this.vis.selectAll(".flats, .years, .subtitle").remove();
         var cars, cars_data, cars_x;
         cars_x = {
           "Дорогі машини": this.width / 6,
           "Бетмобілі": this.width / 2,
           "Мільйонні автопарки": this.width / 6*5
         };
         cars_y = {
           "загальна вартість: 500 - 699 тис грн*": this.width / 6,
           "загальна вартість: 700 тис - 999 тис грн*": this.width / 2,
           "загальна вартість: більше 1 млн грн*": this.width / 6*5
         };
         cars_data = d3.keys(cars_x);
         cars_data2 = d3.keys(cars_y);
         cars = this.vis.selectAll(".cars").data(cars_data);
         cars2 = this.vis.selectAll(".subtitle").data(cars_data2);
         cars.enter().append("text").attr("class", "cars").attr("x", (function(_this) {
           return function(d) {
             return cars_x[d];
           };
         })(this)).attr("y", 40).attr("text-anchor", "middle").text(function(d) {
           return d;
         });
         cars2.enter().append("text").attr("class", "subtitle").attr("x", (function(_this) {
         return function(d) {
           return cars_y[d];
         };
       })(this)).attr("y", 60).attr("text-anchor", "middle").text(function(d) {
         return d;
       });
     };




       BeeChart.prototype.display_by_flat = function() {
         this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function(_this) {
           return function(e) {
             return _this.circles.each(_this.move_towards_flat(e.alpha)).attr("x", function(d) {
               return d.x;
             }).attr("y", function(d) {
               return d.y;
             });
           };
         })(this));
         this.force.start();
         return this.display_flats();
       };

       BeeChart.prototype.move_towards_flat = function(alpha) {
         return (function(_this) {
           return function(d) {
             var target;
             target = _this.centers[d.flat];
             d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 1.1;
             return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 1.1;
           };
         })(this);
       };

       BeeChart.prototype.display_flats = function() {
         this.vis.selectAll(".cars, .years, .subtitle").remove();
         var flats, flats_data, flats_x;
         flats_x = {
           "Маєтки": this.width / 6,
           "Вілли": this.width / 2,
           "Палаци":this.width / 6*5
         };
         flats_y = {
           "загальний метраж нерухомості: 500 - 699 м²": this.width / 6,
           "загальний метраж нерухомості: 700 - 999 м²": this.width / 2,
           "загальний метраж нерухомості: 1000 і більше м²": this.width /6*5
         };
         flats_data = d3.keys(flats_x);
         flats_data2 = d3.keys(flats_y);
         flats = this.vis.selectAll(".flats").data(flats_data);
         flats2 = this.vis.selectAll(".subtitle").data(flats_data2);
         flats.enter().append("text").attr("class", "flats").attr("x", (function(_this) {
           return function(d) {
             return flats_x[d];
           };
         })(this)).attr("y", 40).attr("text-anchor", "middle").text(function(d) {
           return d;
         });
         flats2.enter().append("text").attr("class", "subtitle").attr("x", (function(_this) {
           return function(d) {
             return flats_y[d];
           };
         })(this)).attr("y", 60).attr("text-anchor", "middle").text(function(d) {
           return d;
         });
       };



       BeeChart.prototype.display_by_year = function() {
         this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function(_this) {
           return function(e) {
             return _this.circles.each(_this.move_towards_year(e.alpha)).attr("x", function(d) {
               return d.x;
             }).attr("y", function(d) {
               return d.y;
             });
           };
         })(this));
         this.force.start();
         return this.display_years();
       };

       BeeChart.prototype.move_towards_year = function(alpha) {
         return (function(_this) {
           return function(d) {
             var target;
             target = _this.centers[d.year];
             d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 1.1;
             return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 1.1;
           };
         })(this);
       };

       BeeChart.prototype.display_years = function() {
         this.vis.selectAll(".cars, .flats, .subtitle").remove();
         var years, years_data, years_x;
         years_x = {
           "Eконом": this.width / 6,
           "Живуть на одну зарплатню": this.width / 2,
           "Можуть не їсти роками": this.width / 6 *5
         };
         years_y = {
           "вартість машин < сумарної зарплатні за 5 років": this.width / 6,
           "вартість машин = сумарній зарплатні за 5 - 7 років": this.width / 2,
           "вартість машин > сумарніої зарплатні за 7 років": this.width / 6 *5
         };
         years_data = d3.keys(years_x);
         years_data2 = d3.keys(years_y);
         years = this.vis.selectAll(".years").data(years_data);
         years2 = this.vis.selectAll(".years").data(years_data2);
         years.enter().append("text").attr("class", "years").attr("x", (function(_this) {
           return function(d) {
             return years_x[d];
           };
         })(this)).attr("y", 40).attr("text-anchor", "middle").text(function(d) {
           return d;
         });
         years2.enter().append("text").attr("class", "subtitle").attr("x", (function(_this) {
           return function(d) {
             return years_y[d];
           };
         })(this)).attr("y", 60).attr("text-anchor", "middle").text(function(d) {
           return d;
         });
       };



       BeeChart.prototype.show_details = function(data, i, element) {
         var content;
         d3.select(element).attr("stroke", "black");
         content = "<span class=\"name\">Ім'я:</span><span class=\"value\"> " + data.name + "</span><br/>";
         content += "<span class=\"name\">Посада:</span><span class=\"value\"> " + data.position + "</span><br/>";
         content += "<span class=\"name\">Зарплатня:</span><span class=\"value\"> " + data.salary + " грн" +"</span><br/>";
         content += "<span class=\"name\">Вартійсть машин сім'ї:</span><span class=\"value\"> " + data.car_price + " млн грн" +"</span><br/>";
         content += "<span class=\"name\">Метраж нерухомості:</span><span class=\"value\"> " + data.estate + " м²" + "</span><br/>";
         content += "<span>Для купівлі машин потрібно було економити </span><span class=\"value\"> " + data.car_years + " р." + "</span>";
         return this.tooltip.showTooltip(content, d3.event);
       };

       BeeChart.prototype.hide_details = function(data, i, element) {
         d3.select(element).attr("stroke", (function(_this) {
           return function(d) {
             return d3.rgb(_this.fill_color(d.group)).darker();
           };
         })(this));
         return this.tooltip.hideTooltip();
       };

       return BeeChart;

     })();

     root = typeof exports !== "undefined" && exports !== null ? exports : this;

     $(function() {
       var chart, render_vis;
       chart = null;
       render_vis = function(csv) {
         chart = new BeeChart(csv);
         chart.start();
         return root.display_all();
       };
       $("#flat").click(function(){
         return chart.display_by_flat();
       });
       $("#car").click(function(){
         return chart.display_by_car();
       })
       $("#year").click(function(){
         return chart.display_by_year();
       })
       root.display_all = (function(_this) {
         return function() {
           return chart.display_group_all();
         };
       })(this);
       return d3.csv("data/data_update.csv", render_vis);
     });

   }).call(this);

} else {

  (function() {
    var BeeChart, root,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    BeeChart = (function() {
      function BeeChart(data) {
        this.hide_details = __bind(this.hide_details, this);
        this.show_details = __bind(this.show_details, this);
        this.hide_cars = __bind(this.hide_cars, this);
        this.display_cars = __bind(this.display_cars, this);
        this.move_towards_car = __bind(this.move_towards_car, this);
        this.display_by_car = __bind(this.display_by_car, this);
        this.hide_flats = __bind(this.hide_flats, this);
        this.display_flats = __bind(this.display_flats, this);
        this.move_towards_flat = __bind(this.move_towards_flat, this);
        this.display_by_flat = __bind(this.display_by_flat, this);
        this.hide_years = __bind(this.hide_years, this);
        this.display_years = __bind(this.display_years, this);
        this.move_towards_year = __bind(this.move_towards_year, this);
        this.display_by_year = __bind(this.display_by_year, this);
        this.move_towards_center = __bind(this.move_towards_center, this);
        this.display_group_all = __bind(this.display_group_all, this);
        this.start = __bind(this.start, this);
        this.create_vis = __bind(this.create_vis, this);
        this.create_nodes = __bind(this.create_nodes, this);
        var max_amount;
        this.data = data;
        this.width = chartwidth;
        this.height = 400;
        this.tooltip = CustomTooltip("gates_tooltip", 240);
        this.center = {
          x: this.width / 2,
          y: this.height / 2
        };
        this.centers = {
          "low": {
            x: this.width / 10,
            y: this.height * 100
          },
          "medium": {
            x: 2 * this.width / 3.5,
            y: this.height / 2.1
          },
          "high": {
            x: 2 * this.width / 5,
            y: this.height / 2.1
          }
        };
        this.layout_gravity = -0.03;
        this.damper = 0.07;
        this.vis = null;
        this.nodes = [];
        this.force = null;
        this.circles = null;
        this.fill_color = d3.scale.ordinal().domain(["superlow","low", "medium", "high"]).range(["#d84b2a", "#beccae", "#7aa25c"]);
        max_amount = d3.max(this.data, function(d) {
          return parseInt(d.total_amount);
        });
        //this.radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([5, 10]);
        this.create_nodes();
        this.create_vis();
      }

      BeeChart.prototype.create_nodes = function() {
        this.data.forEach((function(_this) {
          return function(d) {
            var node;
            node = {
              id: d.id,
              radius: 7,
              salary: d.monthly_salary,
              position: d.position,
              name: d.name,
              org: d.position,
              group: d.group,
              car: d.group_car,
              car_price: d.all_cars_sum_uah_mln,
              flat:d.group_flat,
              year:d.group_years,
              estate: d.all_estate,
              x: Math.random() * 900,
              y: Math.random() * 800
            };
            return _this.nodes.push(node);
          };
        })(this));
      };


      BeeChart.prototype.create_vis = function() {
        var that;
        this.vis = d3.select("#vis").append("svg").attr("width", this.width).attr("height", this.height).attr("id", "svg_vis");
        this.circles = this.vis.selectAll("image").data(this.nodes, function(d) {
          return d.id;
        });
        that = this;
        this.circles
        .enter()
        .append("image")
        .attr('class', 'beenode')
        .attr("xlink:href", function(d) {
          if (d.group == "суди")  {return "https://dl.dropboxusercontent.com/u/82823005/beeproject/mosquito.svg"}
          else if  (d.group == "МВС") {return "https://dl.dropboxusercontent.com/u/82823005/beeproject/mosquito2.svg"}
          else {return "https://dl.dropboxusercontent.com/u/82823005/beeproject/mosquito3.svg"}
        })
        .attr("x", this.width * Math.random())
        .attr("y", this.height * Math.random())
        .attr("width", 20)
        .attr("height", 20)
        .attr("id", function(d) {
          return "Bee_" + d.id;
        }).on("mouseover", function(d, i) {
          return that.show_details(d, i, this);
        }).on("mouseout", function(d, i) {
          return that.hide_details(d, i, this);
        }).on('click', function(d, i) {
           window.location.href = "http://declarations.com.ua/declaration/" + d.id;
           });
      };

      BeeChart.prototype.charge = function(d) {
        return -Math.pow(d.radius, 2.0) / 8;
      };

      BeeChart.prototype.start = function() {
        return this.force = d3.layout.force().nodes(this.nodes).size([this.width, this.height]);
      };

      BeeChart.prototype.display_group_all = function() {
        this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function(_this) {
          return function(e) {
            return _this.circles.each(_this.move_towards_center(e.alpha)).attr("x", function(d) {
              return d.x;
            }).attr("y", function(d) {
              return d.y;
            });
          };
        })(this));
        this.force.start();
        return this.vis.selectAll(".cars, .flats, .years").remove();
      };

      BeeChart.prototype.move_towards_center = function(alpha) {
        return (function(_this) {
          return function(d) {
            d.x = d.x + (_this.center.x - d.x) * (_this.damper + 0.02) * alpha;
            return d.y = d.y + (_this.center.y - d.y) * (_this.damper + 0.02) * alpha;
          };
        })(this);
      };

      BeeChart.prototype.display_by_car = function() {
        this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function(_this) {
          return function(e) {
            return _this.circles.each(_this.move_towards_car(e.alpha)).attr("x", function(d) {
              return d.x;
            }).attr("y", function(d) {
              return d.y;
            });
          };
        })(this));
        this.force.start();
        return this.display_cars();
      };

      BeeChart.prototype.move_towards_car = function(alpha) {
        return (function(_this) {
          return function(d) {
            var target;
            target = _this.centers[d.car];
            d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 1.1;
            return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 1.1;
          };
        })(this);
      };

      BeeChart.prototype.display_cars = function() {
        this.vis.selectAll(".flats, .years, .subtitle").remove();
        var cars, cars_data, cars_x;
        cars_x = {
          "Бетмобілі": this.width / 5,
          "Мільйонні автопарки": this.width / 1.5
        };
        cars_y = {
          "700 тис - 999 тис грн*": this.width / 5,
          "більше 1 млн грн*": this.width / 1.5
        };
        cars_data = d3.keys(cars_x);
        cars_data2 = d3.keys(cars_y);
        cars = this.vis.selectAll(".cars").data(cars_data);
        cars2 = this.vis.selectAll(".subtitle").data(cars_data2);
        cars.enter().append("text").attr("class", "cars").attr("x", (function(_this) {
          return function(d) {
            return cars_x[d];
          };
        })(this)).attr("y", 40).attr("text-anchor", "middle").text(function(d) {
          return d;
        });
        cars2.enter().append("text").attr("class", "subtitle").attr("x", (function(_this) {
        return function(d) {
          return cars_y[d];
        };
      })(this)).attr("y", 60).attr("text-anchor", "middle").text(function(d) {
        return d;
      });
    };




      BeeChart.prototype.display_by_flat = function() {
        this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function(_this) {
          return function(e) {
            return _this.circles.each(_this.move_towards_flat(e.alpha)).attr("x", function(d) {
              return d.x;
            }).attr("y", function(d) {
              return d.y;
            });
          };
        })(this));
        this.force.start();
        return this.display_flats();
      };

      BeeChart.prototype.move_towards_flat = function(alpha) {
        return (function(_this) {
          return function(d) {
            var target;
            target = _this.centers[d.flat];
            d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 1.1;
            return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 1.1;
          };
        })(this);
      };

      BeeChart.prototype.display_flats = function() {
        this.vis.selectAll(".cars, .years, .subtitle").remove();
        var flats, flats_data, flats_x;
        flats_x = {
          "Вілли": this.width / 5,
          "Палаци":this.width / 1.5
        };
        flats_y = {
          "700 - 999 м²": this.width / 5,
          "1000 і більше м²": this.width / 1.5
        };
        flats_data = d3.keys(flats_x);
        flats_data2 = d3.keys(flats_y);
        flats = this.vis.selectAll(".flats").data(flats_data);
        flats2 = this.vis.selectAll(".subtitle").data(flats_data2);
        flats.enter().append("text").attr("class", "flats").attr("x", (function(_this) {
          return function(d) {
            return flats_x[d];
          };
        })(this)).attr("y", 40).attr("text-anchor", "middle").text(function(d) {
          return d;
        });
        flats2.enter().append("text").attr("class", "subtitle").attr("x", (function(_this) {
          return function(d) {
            return flats_y[d];
          };
        })(this)).attr("y", 60).attr("text-anchor", "middle").text(function(d) {
          return d;
        });
      };



      BeeChart.prototype.display_by_year = function() {
        this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function(_this) {
          return function(e) {
            return _this.circles.each(_this.move_towards_year(e.alpha)).attr("x", function(d) {
              return d.x;
            }).attr("y", function(d) {
              return d.y;
            });
          };
        })(this));
        this.force.start();
        return this.display_years();
      };

      BeeChart.prototype.move_towards_year = function(alpha) {
        return (function(_this) {
          return function(d) {
            var target;
            target = _this.centers[d.year];
            d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 1.1;
            return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 1.1;
          };
        })(this);
      };

      BeeChart.prototype.display_years = function() {
        this.vis.selectAll(".cars, .flats, .subtitle").remove();
        var years, years_data, years_x;
        years_x = {
          "Cупереконом": this.width / 5,
          "Не їдять роками": this.width / 1.5
        };
        years_y = {
          "ціна машин = з/п за 5 - 7 р.": this.width / 5,
          "ціна машин > з/п за 7 р.": this.width / 1.5
        };
        years_data = d3.keys(years_x);
        years_data2 = d3.keys(years_y);
        years = this.vis.selectAll(".years").data(years_data);
        years2 = this.vis.selectAll(".years").data(years_data2);
        years.enter().append("text").attr("class", "years").attr("x", (function(_this) {
          return function(d) {
            return years_x[d];
          };
        })(this)).attr("y", 40).attr("text-anchor", "middle").text(function(d) {
          return d;
        });
        years2.enter().append("text").attr("class", "subtitle").attr("x", (function(_this) {
          return function(d) {
            return years_y[d];
          };
        })(this)).attr("y", 60).attr("text-anchor", "middle").text(function(d) {
          return d;
        });
      };



      BeeChart.prototype.show_details = function(data, i, element) {
        var content;
        d3.select(element).attr("stroke", "black");
        content = "<span class=\"name\">Ім'я:</span><span class=\"value\"> " + data.name + "</span><br/>";
        content += "<span class=\"name\">Посада:</span><span class=\"value\"> " + data.position + "</span><br/>";
        content += "<span class=\"name\">Зарплатня:</span><span class=\"value\"> " + data.salary + " грн" +"</span><br/>";
        content += "<span class=\"name\">Вартійсть машин сім'ї:</span><span class=\"value\"> " + data.car_price + " млн грн" +"</span><br/>";
        content += "<span class=\"name\">Метраж нерухомості:</span><span class=\"value\"> " + data.estate + " м²" + "</span>";
        content += "<span>Для купівлі машин потрібно було економити </span><span class=\"value\"> " + data.car_years + " р." + "</span>";
        return this.tooltip.showTooltip(content, d3.event);
      };

      BeeChart.prototype.hide_details = function(data, i, element) {
        d3.select(element).attr("stroke", (function(_this) {
          return function(d) {
            return d3.rgb(_this.fill_color(d.group)).darker();
          };
        })(this));
        return this.tooltip.hideTooltip();
      };

      return BeeChart;

    })();

    root = typeof exports !== "undefined" && exports !== null ? exports : this;

    $(function() {
      var chart, render_vis;
      chart = null;
      render_vis = function(csv) {
        chart = new BeeChart(csv);
        chart.start();
        return root.display_all();
      };
      $("#flat").click(function(){
        return chart.display_by_flat();
      });
      $("#car").click(function(){
        return chart.display_by_car();
      })
      $("#year").click(function(){
        return chart.display_by_year();
      })
      root.display_all = (function(_this) {
        return function() {
          return chart.display_group_all();
        };
      })(this);
      return d3.csv("data/mobile_data.csv", render_vis);
    });

  }).call(this);


}

wp1.destroy()
},
  offset: '90%'
});
