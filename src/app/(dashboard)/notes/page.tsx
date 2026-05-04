import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function NotesPage() {
  const session = await auth()

  const notes = await prisma.note.findMany({
    where: { userId: session!.user.id },
    include: {
      client: { select: { name: true } },
      deal: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
        <p className="text-gray-500 mt-1">
          {notes.length} catatan meeting
        </p>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 font-medium">Belum ada notes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <p className="text-gray-900 mb-3">{note.content}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                {note.client && <span>👤 {note.client.name}</span>}
                {note.deal && <span>💼 {note.deal.title}</span>}
                {note.meetingAt && (
                  <span>
                    📅 {new Date(note.meetingAt).toLocaleDateString("id-ID")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}