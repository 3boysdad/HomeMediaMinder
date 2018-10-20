function Model_Category(data) {
    this.Confident = data.confident; // confidence level %-wise of the category.
    this.Id = data.id; // the ID of the category (typically a sub-category id
    this.Label = data.label; // the description of the category.
    this.Parent = data.parent; // the parent id of the subcategory.
    this.Score = data.score; // some random score the vendor provides.
}

module.exports = Model_Category;
