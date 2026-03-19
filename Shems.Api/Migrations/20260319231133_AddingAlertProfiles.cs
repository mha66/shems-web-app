using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Shems.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddingAlertProfiles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AlertProfile",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlertType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Threshold = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlertProfile", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AlertProfileDevice",
                columns: table => new
                {
                    AlertProfilesId = table.Column<int>(type: "int", nullable: false),
                    MonitoredDevicesId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlertProfileDevice", x => new { x.AlertProfilesId, x.MonitoredDevicesId });
                    table.ForeignKey(
                        name: "FK_AlertProfileDevice_AlertProfile_AlertProfilesId",
                        column: x => x.AlertProfilesId,
                        principalTable: "AlertProfile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AlertProfileDevice_Devices_MonitoredDevicesId",
                        column: x => x.MonitoredDevicesId,
                        principalTable: "Devices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AlertProfileDevice_MonitoredDevicesId",
                table: "AlertProfileDevice",
                column: "MonitoredDevicesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AlertProfileDevice");

            migrationBuilder.DropTable(
                name: "AlertProfile");
        }
    }
}
