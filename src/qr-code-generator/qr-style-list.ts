import { Options } from "qr-code-styling";
import { Logo } from "./logo.js";

const url = "https://www.tooloogle.com/";
export interface IQrStyleListItem {
    qrCfg: Options;
}

const commonOptions: Options = {
    data: url,
    width: 100,
    height: 100,
    image: Logo,
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 1
    }
}

export const QrStyleList: IQrStyleListItem[] = [{
    qrCfg: {
        ...commonOptions,
        dotsOptions: {
            color: "#4267b2",
            type: "square"
        },
        backgroundOptions: {
            color: "#ffffff"
        }
    }
}, {
    qrCfg: {
        ...commonOptions,
        dotsOptions: {
            color: "#4267b2",
            type: "rounded"
        },
        backgroundOptions: {
            color: "#ffffff"
        }
    }
}, {
    qrCfg: {
        ...commonOptions,
        dotsOptions: {
            color: "#4267b2",
            type: "extra-rounded"
        },
        backgroundOptions: {
            color: "#ffffff"
        }
    }
}, {
    qrCfg: {
        ...commonOptions,
        dotsOptions: {
            color: "#4267b2",
            type: "dots"
        },
        backgroundOptions: {
            color: "#ffffff"
        }
    }
}, {
    qrCfg: {
        ...commonOptions,
        dotsOptions: {
            color: "#4267b2",
            type: "classy"
        },
        backgroundOptions: {
            color: "#ffffff"
        }
    }
}, {
    qrCfg: {
        ...commonOptions,
        dotsOptions: {
            color: "#4267b2",
            type: "classy-rounded"
        },
        backgroundOptions: {
            color: "#ffffff"
        }
    }
}];
