using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Shems.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddingDeviceAlertEventsAlertSubscription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AlertSubscriptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ResidentId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    AlertProfileId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlertSubscriptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AlertSubscriptions_AlertProfiles_AlertProfileId",
                        column: x => x.AlertProfileId,
                        principalTable: "AlertProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AlertSubscriptions_AspNetUsers_ResidentId",
                        column: x => x.ResidentId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DeviceAlertEvents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DeviceId = table.Column<int>(type: "int", nullable: false),
                    ResidentId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsRead = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeviceAlertEvents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DeviceAlertEvents_Devices_DeviceId",
                        column: x => x.DeviceId,
                        principalTable: "Devices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AlertSubscriptions_AlertProfileId",
                table: "AlertSubscriptions",
                column: "AlertProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_AlertSubscriptions_ResidentId",
                table: "AlertSubscriptions",
                column: "ResidentId");

            migrationBuilder.CreateIndex(
                name: "IX_DeviceAlertEvents_DeviceId",
                table: "DeviceAlertEvents",
                column: "DeviceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AlertSubscriptions");

            migrationBuilder.DropTable(
                name: "DeviceAlertEvents");
        }
    }
}
