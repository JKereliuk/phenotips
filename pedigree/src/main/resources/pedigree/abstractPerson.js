
/**
 * A general superclass for Person nodes on the Pedigree graph. Contains information about related nodes
 * and some properties specific for people. Creates an instance of AbstractPersonVisuals on initialization
 *
 * @class AbstractPerson
 * @extends AbstractNode
 * @constructor
 * @param {Number} x The x coordinate on the canvas
 * @param {Number} y The y coordinate on the canvas
 * @param {String} gender Can be "M", "F", or "U"
 * @param {Number} [id] The id of the node
 */

var AbstractPerson = Class.create(AbstractNode, {

    initialize: function($super, x, y, gender, id) {
    	//console.log("abstract person");            
        this._gender = this.parseGender(gender);
        this._isAdopted = false;
        !this._type && (this._type = "AbstractPerson");
        $super(x, y, id);
        //console.log("abstract person end");
      },

    /**
     * Initializes the object responsible for creating graphics for this node
     *
     * @method _generateGraphics
     * @param {Number} x The x coordinate on the canvas at which the node is centered
     * @param {Number} y The y coordinate on the canvas at which the node is centered
     * @return {AbstractPersonVisuals}
     * @private
     */
    _generateGraphics: function(x, y) {
        return new AbstractPersonVisuals(this, x, y);
    },

    /**
     * Reads a string of input and converts it into the standard gender format of "M","F" or "U".
     * Defaults to "U" if string is not recognized
     *
     * @method parseGender
     * @param {String} gender The string to be parsed
     * @return {String} the gender in the standard form ("M", "F", or "U")
     */
    parseGender: function(gender) {
        return (gender.toUpperCase() == 'M' || gender.toUpperCase() == 'F') ? gender.toUpperCase() : 'U';
    },

    /**
     * Returns "U", "F" or "M" depending on the gender of this node
     *
     * @method getGender
     * @return {String}
     */
    getGender: function() {
        return this._gender;
    },

    /**
     * Updates the gender of this node and updates gender of all partners and twins if it is unknown
     *
     * @method setGender
     * @param {String} gender Should be "U", "F", or "M" depending on the gender
     */
    setGender: function(gender) {
    	this._gender = this.parseGender(gender);
        this.getGraphics().setGenderGraphics();
        
        // TODO: Updates gender of all partners and twins if it is unknown
    },

    /**
     * Changes the gender of this node to gender and updates the action stack.
     *
     * @method setGenderAction
     * @param {String} gender Should be "M", "F", or "U"
     */
    setGenderAction: function(gender) {
        //var prevGenders = this.getTwinPartnerGenders();
        this.setGender(gender);
        //var newGenders = this.getTwinPartnerGenders();
        // TODO:
        /*editor.getActionStack().push({
            undo: AbstractNode.setPropertyToListActionUndo,
            redo: AbstractNode.setPropertyToListActionRedo,
            oldValues: prevGenders,
            newValues: newGenders,
            property: 'Gender'
        });*/
    },

    /**
     * Changes the adoption status of this Person to isAdopted. Updates the graphics.
     *
     * @method setAdopted
     * @param {Boolean} isAdopted Set to true if you want to mark the Person adopted
     */
    setAdopted: function(isAdopted) {
        this._isAdopted = isAdopted;
        //TODO: implement adopted and social parents
        if(isAdopted)
            this.getGraphics().drawAdoptedShape();
        else
            this.getGraphics().removeAdoptedShape();

        //TODO: check if needed
        //var preg = this.getParentPregnancy();
        //preg && preg.updateActive();
    },

    /**
     * Changes the adoption status of this Person to isAdopted. Updates the graphics. Updates the
     * action stack.
     *
     * @method setAdoptedAction
     * @param {Boolean} isAdopted Set to true if you want to mark the Person adopted
     */
    setAdoptedAction: function(isAdopted) {
        var oldStatus = this.isAdopted();
        if(oldStatus != isAdopted) {
        	//TODO: asm commented
            //var twin = this.getTwins("PlaceHolder")[0],
            //    twinInfo = twin ? twin.getInfo() : null;
            this.setAdopted(isAdopted);
            var nodeID = this.getID();
            var undo = function() {
                var node = editor.getGraphicsSet().getNode(nodeID);
                if(node) {
                    node.setAdopted(oldStatus);
                	//TODO: asm commented                    
                    //if(twinInfo && node.getParentPregnancy()) {
                    //    var newPh = editor.getGraphicsSet().addPlaceHolder(twinInfo.x, twinInfo.y, twinInfo.gender, twinInfo.id);
                    //    node.getParentPregnancy().addChild(newPh);
                    //}
                }
            };
            var redo = function() {
                var node = editor.getGraphicsSet().getNode(nodeID);
                node && node.setAdopted(isAdopted);
            };
            editor.getActionStack().push({undo: undo, redo: redo});
        }
    },

    /**
     * Returns true if this Person is marked adopted
     *
     * @method isAdopted
     * @return {Boolean}
     */
    isAdopted: function() {
        return this._isAdopted;
    },

    /**
     * Returns a string representing the opposite gender of this node ("M" or "F"). Returns "U"
     * if the gender of this node is unknown
     *
     * @method getOppositeGender
     * @return {String} "M", "F" or "U" depending on the gender of this person
     */
    getOppositeGender : function() {
        if (this.getGender() == "U") {
            return "U";
        }
        else if(this.getGender() == "M") {
            return "F";
        }
        else {
            return "M";
        }
    },

    /**
     * Returns an object containing all the properties of this node
     * except id, x, y & type 
     *
     * @method getProperties
     * @return {Object} in the form
     *
     {
       sex: "gender of the node"
     }
     */
    getProperties: function($super) {
        var info = $super();
        info['gender'] = this.getGender();
        return info;
    },

    /**
     * Applies the properties found in info to this node.
     *
     * @method assignProperties
     * @param properties Object
     * @return {Boolean} True if info was successfully assigned
     */
    assignProperties: function($super, properties) {
        if (!$super(properties))
            return false;
        if (!properties.gender)
            return false;
        
        if(this.getGender() != this.parseGender(properties.gender))
            this.setGender(properties.gender);        
        return true;
    }
});

