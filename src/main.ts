import { BlazeGPU } from '../src/index';

const canvas = document.querySelector("canvas");

const webGPU = new BlazeGPU(canvas);

await webGPU.init();

const shaderName = "Simple shader";
const shaderCode = `@vertex fn vs(
                @builtin(vertex_index) vertexIndex : u32
            ) -> @builtin(position) vec4f {
                let pos = array(
                vec2f( 0.0,  0.5),  // top center
                vec2f(-0.5, -0.5),  // bottom left
                vec2f( 0.5, -0.5)   // bottom right
                );
        
                return vec4f(pos[vertexIndex], 0.0, 1.0);
            }
        
            @fragment fn fs() -> @location(0) vec4f {
                return vec4f(1.0, 0.0, 0.0, 1.0);
            }`;

webGPU.createShader(
    shaderName,
    shaderCode
);

webGPU.createPipeline({
            label:"Simple pipeline",
            layout: "auto",
            vertex: {
                module: webGPU.getModule(),
                entryPoint: "vs",
            },
            fragment: {
                module: webGPU.getModule(),
                entryPoint: "fs",
                targets: [{ format: webGPU.getPresentationFormat() }],
            }
        });

const observer = new ResizeObserver(entries => {
    for (const entry of entries) {
      const width = entry.contentBoxSize[0].inlineSize;
      const height = entry.contentBoxSize[0].blockSize;
      webGPU.getCanvas().width = Math.max(1, Math.min(width, webGPU.getDevice().limits.maxTextureDimension2D));
      webGPU.getCanvas().height = Math.max(1, Math.min(height, webGPU.getDevice().limits.maxTextureDimension2D));
      webGPU.render({
        label: "Simple render pass",
        colorAttachments: [{
            clearValue: [0.3, 0.3, 0.3, 1.0],
            loadOp: "clear",
            storeOp: "store",
        }]
    });
    }
  });

  observer.observe(webGPU.getCanvas());

