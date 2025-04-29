export class BlazeGPU {
    canvas: HTMLCanvasElement;
    context: GPUCanvasContext;
    adapter: GPUAdapter;
    device: GPUDevice;
    presentationFormat: string;
    module: GPUShaderModule;
    pipeline: GPURenderPipeline;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }
    
    async init() {
        this.adapter = await navigator.gpu?.requestAdapter();
        this.device = await this.adapter?.requestDevice();

        if (!this.device) {
            console.log("Browser does not support WebGPU");
        }

        this.context = this.canvas.getContext("webgpu");

        this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();

        this.context.configure({
            device: this.device,
            format: this.presentationFormat,
        });
    }

    createShader(name: string, wgsl: string) {
        this.module = this.device.createShaderModule({
            label: name,
            code: wgsl
        });
    }

    createPipeline() {
        this.pipeline = this.device.createRenderPipeline({
            label:"Simple pipeline",
            layout: "auto",
            vertex: {
                module: this.module,
                entryPoint: "vs",
            },
            fragment: {
                module: this.module,
                entryPoint: "fs",
                targets: [{ format: this.presentationFormat }],
            }
        })
    }

    render() {
        const renderPassDescriptor = {
            label: "Simple render pass",
            colorAttachments: [{
                clearValue: [0.3, 0.3, 0.3, 1.0],
                loadOp: "clear",
                storeOp: "store",
            }]
        }

        renderPassDescriptor.colorAttachments[0].view = this.context.getCurrentTexture().createView();

        const encoder = this.device.createCommandEncoder({ label: "Simple encoder" });

        const pass = encoder.beginRenderPass(renderPassDescriptor);
        pass.setPipeline(this.pipeline);
        pass.draw(3);
        pass.end();

        const commandBuffer = encoder.finish();

        this.device.queue.submit([commandBuffer]);
    }
}
