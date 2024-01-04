const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { 
        type: String, 
        required: true 
    },
    age: { 
        type: Number, 
        required: true 
    },
    mobileNumber: { 
        type: Number, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    isClinician: {
        type: Boolean,
        default: false,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    sessionToken: {
        type: String, 
        required: false 
    },
    lastLoginDate: {
        type: Date,
        required: false
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        required: false,
    },
}, {
    timestamps: true,
    versionKey: false
});

UserSchema.pre("save", function (next) {
    var user = this;
    user.updatedAt = new Date();
  
    if (this.isModified("password") || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }

            bcrypt.hash(
                user.password ? user.password : "",
                salt,
                function (err, hash) {
                    if (err) {
                        return next(err);
                    }

                    user.password = hash;
                    next();
                }
            );
        });
    } else {
      return next();
    }
});

module.exports = mongoose.model("User", UserSchema);