model_list = []

AFRAME.registerComponent("markerhandler",{
    
    getModels : async function(){
        return fetch ("js/model.json")
        .then(res=>res.json())
        .then(data => data)
    },

    init :async function(){

        this.el.addEventListener("markerFound",async ()=>{
            var models = await this.getModels()

            var model_name = this.el.getAttribute("model_name")
            var barcode = this.el.getAttribute("value")
            model_list.push({model_name : model_name, barcode_value : barcode})

            models[barcode]["models"].map(item =>{
                var model = document.querySelector(`${item.model_name}-${barcode_value}`)
                model.setAttribute("visible", true)
            })
        })
        
        this.el.addEventListener("markerLost",()=>{
            var model_name = this.el.getAttribute("model_name")
            var index = model_list.findIndex(x => x.model_name === model_name)
            if (index > -1){
                model_list.splice(index, 1)
            }
        })
    },

    tick : async function(){
        if (model_list.length>1){

            var isbasemodelpresent = this.isModelPresentInArray(model_list, "base")
            var message_text = document.querySelector("#message-text")

            if (!isbasemodelpresent){
                message_text.setAttribute("visible", true)
            }
            else{
                if(models === null){
                    models = await this.getModels()
                }

                message_text.setAttribute("visible", false)

                this.placeTheModel("road", models)
            }
        }
    },

    getDistance : function(elA, elB){
        return elA.object3D.position.distanceTo(elB.object3D.position)
    },

    isModelPresentInArray : function(arr, val){
        for (var i of arr){
            if (i.model_name === val){
                return true
            }
        }
        return false
    },

    getModelGeometry : function(models, model_name){

        var barcodes = Objects.keys(models)

        for (var barcode of barcodes){
            if (models[barcode].model_name === model_name){

                return(
                    position = models[barcode]["placement_position"],
                    rotation = models[barcode]["placement_rotation"],
                    scale = models[barcode]["scale"],
                    model_url = models[barcode]["model_url"]
                )
            }
        }
    },

    placeTheModel : function(model_name, models){
        var isListContainModel = this.isModelPresentInArray(models, model_name)

        if(isListContainModel){
            var distance = null
            var marker1 = document.querySelector("#marker-base")
            var marker2 = document.querySelector(`marker-${model_name}`)

            distance = this.getDistance(marker1, marker2)

            if (distance<1.25){
                var modelEl = document.querySelector(`#${model_name}`)
                modelEl.setAttribute("visible", false)

                var isModelPlaced = document.querySelector(`model-${model_name}`)
                if (isModelPlaced === null){
                    var el = document.createElement("a-entity")
                    var modelGeometry = this.getModelGeometry(models, model_name)

                    el.setAttribute("id" `model-${model_name}`)
                    el.setAttribute("gltf-model", modelGeometry.model_url)
                    el.setAttribute("position", modelGeometry.position)
                    el.setAttribute("rotation", modelGeometry.rotation)
                    el.setAttribute("scale", modelGeometry.scale)

                    marker1.appendChild(el)
                }
            }
        }
    }
})