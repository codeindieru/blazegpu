export class BlazeGPU {
    private canvas: HTMLCanvasElement;
    private context: GPUCanvasContext;
    private adapter: GPUAdapter;
    private device: GPUDevice;
    private presentationFormat: string;
    private module: GPUShaderModule;
    private pipeline: GPURenderPipeline;
    private encoder: GPUCommandEncoder;
    private pass: GPURenderPassEncoder;

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

    createPipeline(pipeline: GPURenderPipelineDescriptor) {
        this.pipeline = this.device.createRenderPipeline(pipeline)
    }

    getModule() {
        return this.module;
    }

    getPresentationFormat() {
        return this.presentationFormat;
    }

    createEncoder(renderPassDescriptor: GPURenderPassDescriptor) {
        renderPassDescriptor.colorAttachments[0].view = this.context.getCurrentTexture().createView();
        this.encoder = this.device.createCommandEncoder({ label: "Simple encoder" });
        this.pass = this.encoder.beginRenderPass(renderPassDescriptor);
    }

    render() {
        this.pass.setPipeline(this.pipeline);
        this.pass.draw(3);
        this.pass.end();

        const commandBuffer = this.encoder.finish();

        this.device.queue.submit([commandBuffer]);
    }
}
