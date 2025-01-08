import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';

const app = fastify();
const prisma = new PrismaClient();

app.get('/api/project/:projectId', async (request: FastifyRequest, reply: FastifyReply) => {
  const { projectId } = request.params as { projectId: string };

  try {
    const project = await prisma.projetos.findUnique({
      where: { id: Number(projectId) },
      include: { sprints: true },
    });

    if (!project) {
      return reply.status(404).send({ error: "Project not found" });
    }

    return reply.send(project);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
});

// Inicia o servidor
app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
