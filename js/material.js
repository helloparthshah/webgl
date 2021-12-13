class Material {

    constructor(ka = [0.5, 0.5, 0.5], kd = [0.5, 0.5, 0.5], ks = [0.2, 0.2, 0.2], alpha = 12) {
        this.ka = ka
        this.kd = kd
        this.ks = ks
        this.alpha = alpha
    }
}

export default Material