import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { projectId } = req.query;

  if (!projectId || Array.isArray(projectId)) {
    res.status(400).json({ error: "Invalid projectId" });
    return;
  }

  try {
    const project = await prisma.projetos.findUnique({
      where: { id: Number(projectId) },
      include: { sprints: true },
    });

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
