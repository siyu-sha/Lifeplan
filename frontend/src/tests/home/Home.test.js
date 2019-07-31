import React from "react";
import Home from "../../home/Home";
import renderer from "react-test-renderer";

test("Test home rendering", () => {
  const component = renderer.create(<Home />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
