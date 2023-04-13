const getDistance = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
  return Math.hypot(x2 - x1, y2 - y1);
};

export const Vector = {
  negate: ({ x, y }) => ({ x: -x, y: -y }),
  add: ({ x: x1, y: y1 }, { x: x2, y: y2 }) => ({ x: x1 + x2, y: y1 + y2 }),
  subtract: ({ x: x1, y: y1 }, { x: x2, y: y2 }) => ({ x: x1 - x2, y: y1 - y2 }),
  length: ({ x, y }) => getDistance({ x: 0, y: 0 }, { x, y }),
  multiply: ({ x, y }, k) => ({ x: x * k, y: y * k }),
  divide: ({ x, y }, k) => ({ x: x / k, y: y / k }),

  angle: ({ x: x1, y: y1 }, { x: x2, y: y2 }) => Math.atan2(y1 * x2 - x1 * y2, x1 * x2 + y1 * y2),
};
export const calculateTransform = (touches, startTouch, startAngle) => {
  if (touches.length === 1) {
    const startPosition = startTouch[0];
    const currentPosition = touches[0];

    return { scale: 1, angle: startAngle, translation: Vector.add(currentPosition, Vector.negate(startPosition)) };
  } else {
    const startPosition = Vector.divide(Vector.add(startTouch[0], startTouch[1]), 2);
    const currentPosition = Vector.divide(Vector.add(touches[0], touches[1]), 2);

    const startVector = Vector.add(startTouch[1], Vector.negate(startTouch[0]));
    const currentVector = Vector.add(touches[1], Vector.negate(touches[0]));

    const scale = Vector.length(currentVector) / Vector.length(startVector);
    let angle = Vector.angle(currentVector, startVector);

    const translation = rotatePoint(Vector.add(currentPosition, Vector.negate(startPosition)), -startAngle + angle);

    return { scale, angle, translation };
  }
};

export const rotatePoint = ({ x, y }, theta) => {
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  return { x: x * cos - y * sin, y: x * sin + y * cos };
};
