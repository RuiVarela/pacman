class Util {
    static equivalent(a, b, epsilon) {
        if (!epsilon) {
            epsilon = Number.EPSILON;
        }

        return (Math.abs(a - b) < epsilon)
    }
}

export default Util;