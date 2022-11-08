module.exports = (sequelize, DataTypes) => {
    const Convert = sequelize.define("Convert", {
        amount:{
            type: DataTypes.INTEGER,
        },
        fromCurrency:{
            type: DataTypes.INTEGER,
        },
        toCurrency:{
            type: DataTypes.INTEGER,
        },
        start_date:{
            type: DataTypes.STRING,
            required: true,
        },
        end_date:{
            type: DataTypes.STRING,
            required:true,
        },
        base:{
            type: DataTypes.STRING,
        },
        Symbols:{
            type: DataTypes.STRING
        }
    })
}