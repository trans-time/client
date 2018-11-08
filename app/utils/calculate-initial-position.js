export default function calculateInitialPosition(idealHeight, idealWidth, imageElement) {
  const idealRatio = idealHeight / idealWidth;
  const actualRatio = imageElement.height / imageElement.width;

  if (actualRatio > idealRatio) {
    const height = imageElement.width * idealRatio;
    const offset = (imageElement.height - height) / 2;
    return [
      0,
      offset / imageElement.height,
      1,
      (offset + height) / imageElement.height
    ]
  } else {
    const width = imageElement.height * (idealWidth / idealHeight);
    const offset = (imageElement.width - width) / 2;

    return [
      offset / imageElement.width,
      0,
      (offset + width) / imageElement.width,
      1
    ]
  }
}
