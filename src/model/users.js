module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        firstName:{
            type: DataTypes.STRING,
            required: true
        },
        lastName:{
            type: DataTypes.STRING,
            required: true
        },
        email:{
            type: DataTypes.STRING,
            required: true
        },
        password:{
            type: DataTypes.STRING,
            required: true
        }
    })
}