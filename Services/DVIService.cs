using Microsoft.Data.SqlClient;
using System.Data;

namespace DVI.API.Services
{
    public class DVIService
    {
        private readonly string _connString;

        public DVIService(IConfiguration config)
        {
            _connString = config.GetConnectionString("VastOfficeDb") ?? throw new ArgumentNullException("Missing connection string.");
        }

        public async Task<List<Dictionary<string, object>>> GetOpenEstimatesAsync()
        {
            var results = new List<Dictionary<string, object>>();

            using var conn = new SqlConnection(_connString);
            using var cmd = new SqlCommand("usp_DVI_GetOpenEstimates", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var row = Enumerable.Range(0, reader.FieldCount)
                    .ToDictionary(reader.GetName, reader.GetValue);
                results.Add(row);
            }

            return results;
        }

        public async Task<int> CreateInspectionAsync(int estimateNumber, int performedBy, string? summary)
        {
            using var conn = new SqlConnection(_connString);
            using var cmd = new SqlCommand("usp_DVI_CreateInspection", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@EstimateNumber", estimateNumber);
            cmd.Parameters.AddWithValue("@PerformedBy", performedBy);
            cmd.Parameters.AddWithValue("@Summary", summary ?? "");

            await conn.OpenAsync();
            var result = await cmd.ExecuteScalarAsync();

            return Convert.ToInt32(result);
        }

        public async Task SaveChecklistResultAsync(int inspectionId, int itemId, string status, string? notes)
        {
            using var conn = new SqlConnection(_connString);
            using var cmd = new SqlCommand("usp_DVI_SaveChecklistResult", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@InspectionID", inspectionId);
            cmd.Parameters.AddWithValue("@ItemID", itemId);
            cmd.Parameters.AddWithValue("@Status", status);
            cmd.Parameters.AddWithValue("@Notes", notes ?? "");

            await conn.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }
        public async Task<List<Dictionary<string, object>>> GetChecklistTemplatesAsync()
        {
            var results = new List<Dictionary<string, object>>();
            using var conn = new SqlConnection(_connString);
            using var cmd = new SqlCommand("usp_DVI_GetTemplates", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var row = Enumerable.Range(0, reader.FieldCount)
                    .ToDictionary(reader.GetName, reader.GetValue);
                results.Add(row);
            }
            return results;
        }

        public async Task<List<Dictionary<string, object>>> GetChecklistItemsAsync(int templateId)
        {
            var results = new List<Dictionary<string, object>>();
            using var conn = new SqlConnection(_connString);
            using var cmd = new SqlCommand("usp_DVI_GetTemplateItems", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@TemplateID", templateId);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var row = Enumerable.Range(0, reader.FieldCount)
                    .ToDictionary(reader.GetName, reader.GetValue);
                results.Add(row);
            }
            return results;
        }

        public async Task<int> CreateChecklistTemplateAsync(string templateName, int createdBy)
        {
            using var conn = new SqlConnection(_connString);
            using var cmd = new SqlCommand("usp_DVI_CreateTemplate", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@TemplateName", templateName);
            cmd.Parameters.AddWithValue("@CreatedBy", createdBy);

            await conn.OpenAsync();
            var result = await cmd.ExecuteScalarAsync();

            return Convert.ToInt32(result);
        }

        public async Task AddChecklistItemAsync(Models.AddChecklistItemRequest request)
        {
            using var conn = new SqlConnection(_connString);
            using var cmd = new SqlCommand("usp_DVI_AddTemplateItem", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@TemplateID", request.TemplateID);
            cmd.Parameters.AddWithValue("@ItemName", request.ItemName);
            cmd.Parameters.AddWithValue("@Category", request.Category);
            cmd.Parameters.AddWithValue("@DisplayOrder", request.DisplayOrder);

            await conn.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }
        public async Task SaveMediaAsync(int resultId, string fileUrl, string mediaType)
        {
            using var conn = new SqlConnection(_connString);
            using var cmd = new SqlCommand("usp_DVI_SaveMedia", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@ResultID", resultId);
            cmd.Parameters.AddWithValue("@FileURL", fileUrl);
            cmd.Parameters.AddWithValue("@MediaType", mediaType);

            await conn.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task<List<Dictionary<string, object>>> GetMediaByResultIdAsync(int resultId)
        {
            var results = new List<Dictionary<string, object>>();
            using var conn = new SqlConnection(_connString);
            using var cmd = new SqlCommand("usp_DVI_GetMediaByResult", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@ResultID", resultId);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var row = Enumerable.Range(0, reader.FieldCount)
                    .ToDictionary(reader.GetName, reader.GetValue);
                results.Add(row);
            }
            return results;
        }
        public async Task<List<Dictionary<string, object>>> GetInspectionsByEstimateAsync(int estimateNumber)
        {
            var results = new List<Dictionary<string, object>>();
            using var conn = new SqlConnection(_connString);
            using var cmd = new SqlCommand("usp_DVI_GetInspectionsByEstimate", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@EstimateID", estimateNumber);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var row = Enumerable.Range(0, reader.FieldCount)
                    .ToDictionary(reader.GetName, reader.GetValue);
                results.Add(row);
            }
            return results;
        }

        public async Task<List<List<Dictionary<string, object>>>> GetFullInspectionDetailsAsync(int inspectionId)
        {
            var resultSets = new List<List<Dictionary<string, object>>>();
            using var conn = new SqlConnection(_connString);
            using var cmd = new SqlCommand("usp_DVI_GetInspectionDetails", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@InspectionID", inspectionId);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (!reader.IsClosed)
            {
                var rows = new List<Dictionary<string, object>>();
                while (await reader.ReadAsync())
                {
                    var row = Enumerable.Range(0, reader.FieldCount)
                        .ToDictionary(reader.GetName, reader.GetValue);
                    rows.Add(row);
                }

                resultSets.Add(rows);

                if (!await reader.NextResultAsync())
                    break;
            }

            return resultSets;
        }

    }
}
