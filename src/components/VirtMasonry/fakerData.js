import faker from "faker";

const fakerData = (count = 100) => {
  let data = [];

  const ROW_HEIGHTS = [25, 50, 75, 100];

  for (let i = 0; i < count; i++) {
    data.push({
      size: ROW_HEIGHTS[Math.floor(Math.random() * ROW_HEIGHTS.length)],
      color: faker.internet.color()
    });
  }
  return data;
};

export default fakerData;
