function Model_Category(data) {
    this.Confident = data.confident;
    this.Id = data.id;
    this.Label = data.label;
    this.Parent = data.parent;
    this.Score = data.score;
}

module.exports = Model_Category;
