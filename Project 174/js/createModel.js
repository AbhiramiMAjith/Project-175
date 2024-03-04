AFRAME.registerComponent("create-models",{
    init : async function(){
        var models = await this.getModels()

        var barcodes = Object.keys(models)

        barcodes.map(barcode=>{
            var model = models[barcode]

            this.createModel(model)
        })
    },
    getModels : async function(){
        return fetch ("js/model.json")
        .then(res=>res.json())
        .then(data => data)
    },
    createModel :async function(model){
        var model_name = model.model_name
        var model_url = model.model_url
        var barcodeValue = model.barcode_value

        var scene = document.querySelector("a-scene")
        var marker = document.createElement("a-marker")

        marker.setAttribute("id",`marker-${model_name}`)
        marker.setAttribute("type","barcode")
        marker.setAttribute("model_name", model_name)
        marker.setAttribute("value", barcodeValue)
        marker.setAttribute("markerhandler",{})
        scene.appendChild(marker)

        if (barcodeValue === 0){
            var modelEl = document.createElement("a-entity")

            modelEl.setAttribute("id", `${model_name}`)
            modelEl.setAttribute("geometry",{
                primitive :"box",
                width : model.width,
                height : model.height
            })
            modelEl.setAttribute("position", model.position)
            modelEl.setAttribute("rotation", model.rotation)
            modelEl.setAttribute("material",{
                color : model.color
            })
            marker.appendChild(modelEl)
        }
        else{
            var modelEl = document.createElement("a-entity")
            modelEl.setAttribute("id", `${model_name}`)
            modelEl.setAttribute("gltf-model",`${model_url}`)
            modelEl.setAttribute("scale",model.scale)
            modelEl.setAttribute("position",model.position)
            modelEl.setAttribute("rotation",model.rotation)

            marker.appendChild(modelEl)
        }
    }
})