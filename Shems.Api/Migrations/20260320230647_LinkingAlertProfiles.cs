using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Shems.Api.Migrations
{
    /// <inheritdoc />
    public partial class LinkingAlertProfiles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AlertProfileDevice_AlertProfile_AlertProfilesId",
                table: "AlertProfileDevice");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AlertProfile",
                table: "AlertProfile");

            migrationBuilder.RenameTable(
                name: "AlertProfile",
                newName: "AlertProfiles");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AlertProfiles",
                table: "AlertProfiles",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AlertProfileDevice_AlertProfiles_AlertProfilesId",
                table: "AlertProfileDevice",
                column: "AlertProfilesId",
                principalTable: "AlertProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AlertProfileDevice_AlertProfiles_AlertProfilesId",
                table: "AlertProfileDevice");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AlertProfiles",
                table: "AlertProfiles");

            migrationBuilder.RenameTable(
                name: "AlertProfiles",
                newName: "AlertProfile");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AlertProfile",
                table: "AlertProfile",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AlertProfileDevice_AlertProfile_AlertProfilesId",
                table: "AlertProfileDevice",
                column: "AlertProfilesId",
                principalTable: "AlertProfile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
