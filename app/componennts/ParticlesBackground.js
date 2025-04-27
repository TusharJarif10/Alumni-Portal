import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFireworksPreset } from "tsparticles-preset-fireworks";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFireworksPreset(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        preset: "fireworks",
        particles: {
          number: {
            value: 0.1, // Number of particles
            density: {
              enable: true,
              value_area: 500, // Defines the area where the particles can appear
            },
          },
          shape: {
            type: "circle", // Change to "star", "triangle", or other shapes if desired
          },
          color: {
            value: ["#ff0000", "#00ff00", "#0000ff"], // Custom colors for fireworks
          },
          size: {
            value: 1, // Size of individual particles
            random: true, // Randomize the size
            animation: {
              enable: true,
              speed: 0.00001, // Speed of size expansion
              minimumValue: 2, // Minimum size of particles
            },
          },
          opacity: {
            value: 0.001, // Transparency level
            random: true, // Random opacity for variation
            animation: {
              enable: true,
              speed: 0.001, // Speed of opacity change
              minimumValue: 0.01, // Minimum opacity
            },
          },
          move: {
            enable: true,
            speed: 0.01, // Particle speed
            direction: "none", // Direction of particles' movement (e.g., "top", "bottom", "none")
            random: true, // Randomize movement
            straight: false, // Particles will move in a curved path
            outModes: {
              default: "out", // Make particles disappear when they leave the canvas
            },
            attract: {
              enable: false, // Disable attraction to a center point
            },
          },
          links: {
            enable: false, // Disable particle linking (for a cleaner effect)
          },
          collisions: {
            enable: true, // Enable collision between particles
            mode: "bounce", // Particles will bounce off each other
          },
          life: {
            duration: {
              value: 0.01, // Duration of each firework particle
            },
            count: 0.01, // Number of times the particles will spawn
          },
        },
        fullScreen: {
          enable: true, // Fullscreen particles
          zIndex: 1, // Layer position
        },
        interactivity: {
          events: {
            onClick: {
              enable: true, // Enable particles to trigger on click
              mode: "push", // Add particles on click
            },
            onHover: {
              enable: true, // Enable particles to react to hover
              mode: "repulse", // Repel particles when hovering
            },
          },
          modes: {
            push: {
              quantity: 1, // Number of particles pushed when clicked
            },
            repulse: {
              distance: 500, // Distance of repulsion on hover
              duration: 0.1, // Duration of the repulsion effect
            },
          },
        },
      }}
    />
  );
};

export default ParticlesBackground;
